<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { GameplayScene } from '../../game/gameplayScene'
import { gameState } from '../../game/gameState'
import type { Player } from '../../models/player'
import { useRouter, useRoute } from 'vue-router'
import { words } from '../../data/words.ts'
import { playClick, stopMenuSong } from '../../game/audio.ts'

const phase = ref<'presentation' | 'game'>('presentation')
const currentIndex = ref(0)
const revealed = ref(false)
const displayText = ref('')
const displayWord = ref('')
const impostorReveal = ref('')
const wordsData = ref()

const router = useRouter()
const route = useRoute()
const players = ref<Player[]>([])

let phaserGame: Phaser.Game | null = null

function getRandomWords(data: { category: string; words: string[] }[]) {
  const randomCategory = data[Math.floor(Math.random() * data.length)];
  
  const words = randomCategory?.words || [];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  return {
      category: randomCategory?.category,
      word: randomWord
  };
}


function coverRole() {
  impostorReveal.value = ''
  const player: Player | undefined = players.value[currentIndex.value]
  if (player) {
    displayText.value = player.name
    displayWord.value = ''
  }
  revealed.value = false
}

function revealRole() {
  const player: Player | undefined = players.value[currentIndex.value]

  if (!player) {
    displayText.value = 'No hay jugador en esta posición'
    return
  }

  // Si es impostor, mostrar ???
  if (player.isImpostor) {
    displayWord.value = `?????`
    impostorReveal.value = `Tu eres el impostor! SILENCIO!`
  } else {
    displayWord.value = player.word
    impostorReveal.value = ''
  }

  playClick()
  revealed.value = true
}

function nextPlayer() {
  currentIndex.value++

  if (currentIndex.value >= players.value.length) {
    phase.value = 'game'
    return
  }
  coverRole()
  playClick()
}

coverRole()

watch(phase, (newPhase) => {
  if (newPhase === 'game' && !phaserGame) {
    phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 640*2,
      height: 360*2,
      pixelArt: true,
      antialias: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
      },
      parent: 'phaser-container',
      backgroundColor: '#ffff',
      scene: [
        new GameplayScene(gameState.players)
      ]
    })
  }
})

const onPlayerEliminated = (event: Event) => {
  const customEvent = event as CustomEvent<string>
  const playerName = customEvent.detail

  gameState.players.forEach(player => {
    if (player.name === playerName) {
      player.isActive = false
    }
  })

  const gameEnded = gameState.checkgameEnd()

  if (gameEnded && gameState.winner) {
    router.push({
      path: '/result',
      query: {
        result: gameState.winner === 'crewmates' ? 'victory' : 'defeat'
      }
    })
  }
}

onMounted(() => {
  const playersQuery = route.query.players
  wordsData.value = getRandomWords(words);
  if (playersQuery && typeof playersQuery === 'string') {
    const playerNames = JSON.parse(playersQuery) as string[]
    
    const impostorIndex = Math.floor(Math.random() * playerNames.length)
    players.value = playerNames.map((name, index) => ({
      name,
      isImpostor: index === impostorIndex,
      isActive: true,
      word: index === impostorIndex ? wordsData.value.category : wordsData.value.word
    }))

    gameState.players = players.value
    coverRole()
  }
})

onMounted(() => {
  window.addEventListener('game:player-eliminated', onPlayerEliminated)
})

onUnmounted(() => {
  stopMenuSong()
  window.removeEventListener('game:player-eliminated', onPlayerEliminated)
})

onUnmounted(() => {
  phaserGame?.destroy(true)
})
</script>

<template>
  <div>
    <div v-if="phase === 'presentation'" class="presentation-phase">
      <div v-if="!revealed">
        <img src="../../assets/TelegramaOverlay.png" alt="Overlay for covering word" class="overlay">
      </div>
      <h1 class="name">{{ displayText }}</h1>
      <h1 class="word">{{ displayWord }}</h1>
      <h1 class="impostor">{{ impostorReveal }}</h1>
      <button v-if="!revealed" @click="revealRole" class="btn-revelar"></button>
      <button v-else @click="nextPlayer" class="btn-siguiente"></button>
    </div>
    <div v-else>
      <div id="phaser-container"></div>
    </div>
  </div>
</template>

<style scoped>
  .presentation-phase {
    position: relative;
    background-image: url('../src/assets/Telegrama.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 100vw;
    height: 100vh;
  }

  .name{
    position: absolute;
    width: 745px;
    top: 32%;
    left: 51.5%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    text-align: center;
    color: black;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  .word{
    display: block;
    width: 760px;
    position: absolute;
    top: 64%;
    left: 40.3%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    text-align: center;
    color: black;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

    .impostor{
    display: block;
    width: 760px;
    position: absolute;
    top: 67.5%;
    left: 40.3%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    text-align: center;
    color: #90220A;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  .btn-revelar{
    width: 150px;
    height: 150px;
    position: absolute;
    top: 46%;
    left: 85%;
    transform: translate(-50%, -50%);
    background-image: url('@/assets/Botones/BotonRevelar01.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    cursor: pointer;
  }

  .btn-revelar:hover {
    background-image: url('@/assets/Botones/BotonRevelar01Hover.png');
  }

  .btn-siguiente{
    width: 160px;
    height: 160px;
    position: absolute;
    top: 46%;
    left: 85%;
    transform: translate(-50%, -50%);
    background-image: url('@/assets/Botones/BotonSiguiente01.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    cursor: pointer;
  }

  .btn-siguiente:hover {
    background-image: url('@/assets/Botones/BotonSiguiente01Hover.png');
  }

  .overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 10;
    pointer-events: none;
  }
</style>

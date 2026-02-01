<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { GameplayScene } from '../../game/gameplayScene'
import { gameState } from '../../game/gameState'
import type { Player } from '../../models/player'
import { useRouter, useRoute } from 'vue-router'
import { words } from '../../data/words.ts'

const phase = ref<'presentation' | 'game'>('presentation')
const currentIndex = ref(0)
const revealed = ref(false)
const displayText = ref('')
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
  const player: Player | undefined = players.value[currentIndex.value]
  if (player) {
    displayText.value = `Turno de ${player.name}. Presiona revelar`
  }
  revealed.value = false
}

function revealRole() {
  const player: Player | undefined = players.value[currentIndex.value]

  if (!player) {
    displayText.value = 'No hay jugador en esta posición'
    return
  }

  if (player.isImpostor) {
    displayText.value = `${player.name} es el IMPOSTOR`
  } else {
    displayText.value =
      `${player.name} es INOCENTE. Palabra: ${player.word}`
  }

  revealed.value = true
}

function nextPlayer() {
  currentIndex.value++

  if (currentIndex.value >= players.value.length) {
    phase.value = 'game'
    return
  }
  coverRole()
}

coverRole()

watch(phase, (newPhase) => {
  if (newPhase === 'game' && !phaserGame) {
    phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 640*2,
      height: 360*2,
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
  window.removeEventListener('game:player-eliminated', onPlayerEliminated)
})

onUnmounted(() => {
  phaserGame?.destroy(true)
})
</script>

<template>
  <div>
    <div v-if="phase === 'presentation'">
      <h1>{{ displayText }}</h1>
      <button v-if="!revealed" @click="revealRole">Revelar</button>
      <button v-else @click="nextPlayer">Siguiente</button>
    </div>
    <div v-else>
      <div id="phaser-container"></div>
    </div>
  </div>
</template>

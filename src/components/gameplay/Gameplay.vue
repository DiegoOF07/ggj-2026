<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { GameplayScene } from '../../game/gameplayScene'
import { gameState } from '../../game/gameState'
import type { Player } from '../../models/player'
import ConfirmationModal from '../common/ConfirmationModal.vue'
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

const showModal = ref(false)
const selectedPlayerName = ref<string | null>(null)

let phaserGame: Phaser.Game | null = null

function getRandomWords(data: { category: string; words: string[] }[]) {
    const randomCategory = data[Math.floor(Math.random() * data.length)];
    
    // Obtener una palabra aleatoria de las palabras de esa categoría
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
      parent: 'phaser-container',
      backgroundColor: '#ffff',
      scene: [
        new GameplayScene(gameState.players)
      ]
    })
  }
})

const onPlayerClicked = (event: Event) => {
  const customEvent = event as CustomEvent<Player>
  selectedPlayerName.value = customEvent.detail.name
  showModal.value = true
  window.dispatchEvent(
    new CustomEvent('vue:modal-open')
  )
}

const confirmDelete = () => {
  if (!selectedPlayerName.value) return

  // Encontrar al jugador que se va a eliminar
  const playerToDelete = gameState.players.find(
    player => player.name === selectedPlayerName.value
  )

  // Marcar como inactivo
  gameState.players.forEach(player => {
    if (player.name === selectedPlayerName.value) {
      player.isActive = false
    }
  })

  // Emitir evento para actualizar UI de Phaser
  window.dispatchEvent(
    new CustomEvent('vue:delete-player', {
      detail: selectedPlayerName.value
    })
  )

  // Verificar si el juego terminó
  const gameEnded = gameState.checkgameEnd()
  
  if (gameEnded && gameState.winner) {
    // Determinar el tipo de resultado desde la perspectiva de los tripulantes
    let resultType = 'defeat'
    
    if (gameState.winner === 'crewmates') {
      // Los tripulantes ganaron = Victoria
      resultType = 'victory'
    } else if (gameState.winner === 'impostors') {
      // Los impostores ganaron = Derrota
      resultType = 'defeat'
    }
    
    // Redirigir a la pantalla de resultados
    router.push({ 
      path: '/result',
      query: {
        result: resultType
      }
    })
  }

  showModal.value = false
  selectedPlayerName.value = null

  window.dispatchEvent(
    new CustomEvent('vue:modal-close')
  )
}

const cancelDelete = () => {
  showModal.value = false
   
  window.dispatchEvent(
    new CustomEvent('vue:modal-close')
  )
}

onMounted(() => {
  const playersQuery = route.query.players
  wordsData.value = getRandomWords(words);
  if (playersQuery && typeof playersQuery === 'string') {
    const playerNames = JSON.parse(playersQuery) as string[]
    
    // Convierte los nombres a objetos Player
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
  window.addEventListener('phaser:player-clicked', onPlayerClicked)
})

onUnmounted(() => {
  window.removeEventListener('phaser:player-clicked', onPlayerClicked)
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
  <ConfirmationModal
    :show="showModal"
    title="¿Desenmascarar jugador?"
    :message="`¿Estas seguro que quieres desenmascarar a ${selectedPlayerName}?`"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
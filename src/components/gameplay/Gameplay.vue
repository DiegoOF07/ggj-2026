<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gameState } from '@/game/gameState'
import type { Player } from '../../models/player'

const names = ['Ana', 'Bob', 'Chris', 'Daniel']
const impostorIndex = Math.floor(Math.random() * names.length)

const players: Player[] = names.map((name, index) => ({
  name,
  isImpostor: index === impostorIndex,
  isActive: true,
  word: null
}))

gameState.players = players

const phase = ref<'presentation' | 'game'>('presentation')
const currentIndex = ref(0)
const displayText = ref('')

function updateDisplay() {
  const player: Player = players[currentIndex.value]

  if (player.isImpostor) {
    displayText.value = `${player.name} is IMPOSTOR`
  } else {
    displayText.value = `${player.name}`
  }
}

onMounted(() => {
  if (players.length === 0) {
    displayText.value = 'No players'
    return
  }

  updateDisplay()

  const interval = setInterval(() => {
    currentIndex.value++

    if (currentIndex.value >= players.length) {
      clearInterval(interval)
      phase.value = 'game'
      return
    }

    updateDisplay()
  }, 5000)
})
</script>

<template>
  <div>
    <div v-if="phase === 'presentation'">
      <h1>{{ displayText }}</h1>
      <p>(pasa automáticamente cada 5 segundos)</p>
    </div>

    <div v-else>
      <h1>Empieza el juego</h1>
    </div>
  </div>
</template>

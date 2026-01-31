<script setup lang="ts">
import { ref } from 'vue'
import type { Player } from '../../models/player'

const names = ['Ana', 'Bob', 'Chris', 'Daniel']
const impostorIndex = Math.floor(Math.random() * names.length)

const players: Player[] = names.map((name, index) => ({
  name,
  isImpostor: index === impostorIndex,
  isActive: true,
  word: 'lentes'
}))

const phase = ref<'presentation' | 'game'>('presentation')
const currentIndex = ref(0)
const revealed = ref(false)

const displayText = ref('')

function coverRole() {
  const player: Player = players[currentIndex.value]
  displayText.value = `Turno de ${player.name}. Presiona revelar`
  revealed.value = false
}

function revealRole() {
  const player = players[currentIndex.value]

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

  if (currentIndex.value >= players.length) {
    phase.value = 'game'
    return
  }
  coverRole()
}

coverRole()
</script>

<template>
  <div>
    <div v-if="phase === 'presentation'">
      <h1>{{ displayText }}</h1>

      <button v-if="!revealed" @click="revealRole">Revelar</button>
      <button v-else @click="nextPlayer">Siguiente</button>
    </div>

    <div v-else>
      <h1>Empieza el juego</h1>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { GameplayScene } from '../../game/gameplayScene'
import { gameState } from '../../game/gameState'
import type { Player } from '../../models/player'

const phase = ref<'presentation' | 'game'>('presentation')
const currentIndex = ref(0)
const revealed = ref(false)
const displayText = ref('')

const names = ['Ana', 'Bob', 'Chris', 'Daniel', 'Erick', 'Fernando', 'Gary']
const impostorIndex = Math.floor(Math.random() * names.length)

const players: Player[] = names.map((name, index) => ({
  name,
  isImpostor: index === impostorIndex,
  isActive: true,
  word: 'lentes'
}))
gameState.players = players

let phaserGame: Phaser.Game | null = null

function coverRole() {
  const player: Player | undefined = players[currentIndex.value]
  if (player) {
    displayText.value = `Turno de ${player.name}. Presiona revelar`
  }
  revealed.value = false
}

function revealRole() {
  const player: Player | undefined = players[currentIndex.value]

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

  if (currentIndex.value >= players.length) {
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

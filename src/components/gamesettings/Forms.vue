<template>
  <div class="screen">
    <h1 class="title">Detrás de las máscaras</h1>
    <p class="subtitle">Ingresa un nombre para cada jugador</p>

    <div class="inputs">
      <input
        v-for="(player, index) in players"
        :key="index"
        v-model="players[index]"
        :placeholder="`Jugador ${index + 1}`"
        type="text"
      />
    </div>

    <button class="continue" @click="continueGame">
      Continuar
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const numberOfPlayers = 7

const players = ref(Array(numberOfPlayers).fill(''))

const continueGame = () => {
  console.log(players.value)
}
</script>

<style scoped>

.screen {
  min-height: 100vh;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 2rem;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 24px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-grow: 1;
}

input {
  padding: 14px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.continue {
  margin-top: 32px;
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

@media (max-width: 400px) {
  .title {
    font-size: 1.6rem;
  }
}
</style>

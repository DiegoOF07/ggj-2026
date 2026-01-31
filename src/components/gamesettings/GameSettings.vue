<template>
  <div class="screen">
    <h1 class="title">Detrás de la máscara</h1>
    <p class="subtitle">Ingresa los nombres o apodos de los jugadores</p>

    <div class="form-wrapper">

      <div class="controls">
        <button @click="decrease" :disabled="playersCount <= minPlayers">−</button>
        <span>{{ playersCount }}</span>
        <button @click="increase" :disabled="playersCount >= maxPlayers">+</button>
      </div>

      <div class="inputs">
        <input
          v-for="(player, index) in players"
          :key="index"
          v-model="players[index]"
          :placeholder="`Jugador ${index + 1}`"
          type="text"
        />
      </div>

      <div v-if="showAlert" class="overlay">
        <div class="alert-card">
          <h2>Faltan nombres</h2>
          <p>Ingresa todos los nombres antes de continuar.</p>

          <button @click="showAlert = false">
            Entendido
          </button>
        </div>
      </div>

      <button class="continue" @click="continueGame">
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Límites
const minPlayers = 3
const maxPlayers = 8

const playersCount = ref(4)
const players = ref(Array(playersCount.value).fill(''))

const showAlert = ref(false)

watch(playersCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    players.value.push('')
  } else {
    players.value.splice(newCount)
  }
})

const increase = () => {
  if (playersCount.value < maxPlayers) playersCount.value++
}

const decrease = () => {
  if (playersCount.value > minPlayers) playersCount.value--
}

const continueGame = () => {
  const hasEmpty = players.value.some(name => name.trim() === '')
  if (hasEmpty) {
    showAlert.value = true
    return
  }

  const playerNames = players.value.filter(name => name.trim() !== '')
  router.push({
    path: '/gameplay',
    query: { players: JSON.stringify(playerNames) }
  })
}
</script>

<style scoped>
/* Pantalla */
.screen {
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Texto */
.title {
  font-size: 2rem;
  margin-bottom: 6px;
}

.subtitle {
  margin-bottom: 24px;
}

/* Wrapper */
.form-wrapper {
  width: 100%;
  max-width: 420px;
}

/* Controls */
.controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.controls button {
  height: 44px;
  font-size: 1.4rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
}

.controls span {
  text-align: center;
  font-weight: 600;
}

/* Inputs */
.inputs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.inputs input {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* Continue */
.continue {
  width: 100%;
  margin-top: 28px;
  padding: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
}

/* 🔴 ALERT MODAL */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-card {
  background: #2e2d2d;
  width: 90%;
  max-width: 320px;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  animation: pop 0.2s ease-out;
}

.alert-card h2 {
  margin-bottom: 8px;
}

.alert-card p {
  margin-bottom: 20px;
}

.alert-card button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

/* Animación */
@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

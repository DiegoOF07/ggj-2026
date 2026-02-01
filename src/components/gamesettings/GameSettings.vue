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
const maxPlayers = 6

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
.screen {
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  padding-top: 10vh;

  background:
    linear-gradient(
      rgba(2, 6, 23, 0.5),
      rgba(2, 6, 23, 0.7)
    ),
    url('@/assets/Background/Background01.png');

  background-size: cover;
  background-position: center 65%;
  background-repeat: no-repeat;

  color: white;
}

.title {
  font-size: 2.2rem;
  margin-bottom: 6px;
  letter-spacing: 1.5px;
}

.subtitle {
  margin-bottom: 32px;
  opacity: 0.85;
  text-align: center;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;

  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);

  padding: 24px;
  border-radius: 20px;
}

.controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.controls button {
  height: 35px;
  font-size: 1.6rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls span {
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inputs input {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(2, 6, 23, 0.6);
  color: white;
}

.inputs input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.continue {
  width: 100%;
  margin-top: 28px;
  padding: 16px;
  font-weight: 600;
  border-radius: 14px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #5B4B8A, #564686);
  color: #ffffff;
}

.continue:hover {
  filter: brightness(1.05);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-card {
  background: rgba(15, 23, 42, 0.95);
  width: 90%;
  max-width: 320px;
  padding: 24px;
  border-radius: 18px;
  text-align: center;
  animation: pop 0.2s ease-out;
  color: white;
}

.alert-card h2 {
  margin-bottom: 8px;
}

.alert-card p {
  margin-bottom: 20px;
  opacity: 0.85;
}

.alert-card button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: #5B4B8A;
  color: #ffffff;
}

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
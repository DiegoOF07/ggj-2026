<template>
  <div class="screen">
    <div class="form-wrapper">

      <h1 class="title">Detrás de la máscara</h1>
      <p class="subtitle">Ingresa los nombres o apodos de los jugadores</p>

      <div class="controls">
        <button
          class="icon-btn minus"
          @click="decrease"
          :disabled="playersCount <= minPlayers"
        />
        <span>{{ playersCount }}</span>
        <button
          class="icon-btn plus"
          @click="increase"
          :disabled="playersCount >= maxPlayers"
        />
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

          <button
            class="alert-btn"
            @click="showAlert = false; playClick()"
          />
        </div>
      </div>

      <button class="continue-btn" @click="continueGame" />

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { playClick } from '../../game/audio'

const router = useRouter()

const minPlayers = 3
const maxPlayers = 6

const playersCount = ref(4)
const players = ref(Array(playersCount.value).fill(''))
const showAlert = ref(false)

watch(playersCount, (newCount, oldCount) => {
  if (newCount > oldCount) players.value.push('')
  else players.value.splice(newCount)
})

const increase = () => {
  if (playersCount.value < maxPlayers) playersCount.value++
  playClick()
}

const decrease = () => {
  if (playersCount.value > minPlayers) playersCount.value--
  playClick()
}

const continueGame = () => {
  playClick()
  if (players.value.some(p => p.trim() === '')) {
    showAlert.value = true
    return
  }

  router.push({
    path: '/gameplay',
    query: { players: JSON.stringify(players.value) }
  })
}
</script>


<style scoped>
.screen {
  min-height: 100vh;
  padding-top: 10vh;

  display: flex;
  justify-content: center;

  background:
    linear-gradient(rgba(2,6,23,.5), rgba(2,6,23,.7)),
    url('@/assets/Background/Background01.png');

  background-size: cover;
  background-position: center;
  color: white;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border-radius: 20px;

  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  text-align: center;
}

.title {
  font-size: 2.2rem;
  margin-bottom: 6px;
}

.subtitle {
  margin-bottom: 20px;
  opacity: 0.85;
}

.controls {
  display: grid;
  grid-template-columns: 200px auto 200px; 
  gap: 8px;                              
  align-items: center;
  justify-items: center;                
  margin-bottom: 15px;
}

.icon-btn {
  width: 72px;            
  height: 72px;
  padding: 0;
  border: none;
  background-color: transparent; 
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;   
  cursor: pointer;
}


.icon-btn.minus {
  background-image: url('@/assets/Botones/BotonMenos01.png');
}
.icon-btn.minus:hover {
  background-image: url('@/assets/Botones/BotonMenos01Hover.png');
}

.icon-btn.plus {
  background-image: url('@/assets/Botones/BotonMas01.png');
}
.icon-btn.plus:hover {
  background-image: url('@/assets/Botones/BotonMas01Hover.png');
}

.icon-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inputs input {
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: rgba(2,6,23,.6);
  color: white;
}

.continue-btn {
  width: 100%;
  height: 64px;
  margin-top: 28px;
  border: none;
  background: url('@/assets/Botones/BotonContinuar01.png') center/contain no-repeat;
  cursor: pointer;
}

.continue-btn:hover {
  background-image: url('@/assets/Botones/BotonContinuar01Hover.png');
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-card {
  width: 320px;
  padding: 28px;
  text-align: center;

  background: url('@/assets/FondoPapel.png') center/cover no-repeat;
  animation: pop .2s ease-out;
  color: #1f2933;
}

.alert-btn {
  width: 180px;
  height: 56px;
  border: none;
  background: url('@/assets/Botones/BotonEntendido01.png') center/contain no-repeat;
  cursor: pointer;
}

.alert-btn:hover {
  background-image: url('@/assets/Botones/BotonEntendido01Hover.png');
}

@keyframes pop {
  from { transform: scale(.9); opacity: 0 }
  to { transform: scale(1); opacity: 1 }
}
</style>

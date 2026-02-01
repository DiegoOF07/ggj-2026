<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()




const goToSettings = () => {
  router.push('/settings')
}

</script>

<template>
  <div class="menu-container">
    <img src="@/assets/Titulo.png" alt="" width="700px">

    <div class="container">
      <p class="history card">
        Un impostor se coló en la noche de brujas de 1924 en Scarlett Valley

        La fiesta privada requiere una contraseña para entrar.

        Averigua quién de los enmascarados no sabe la contraseña y se infiltró en la fiesta.
      </p>

      <button @click="goToSettings" class="play card"></button>
    </div>

  </div>
</template>

<style scoped>
.menu-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background:
    linear-gradient(rgba(2, 6, 23, 0.6),
      rgba(2, 6, 23, 0.8)),
    url('@/assets/Background/Background01.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  color: white;
}


.title {
  font-size: 3rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 2px;
}

.logo {
  font-size: 3.5rem;
  color: #22c55e;
}

.icon {
  font-size: 1.6rem;
}

.play {
  background-image: url('@/assets/Botones/BotonJugar01.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.play:hover {
  background-image: url('@/assets/Botones/BotonJugar01Hover.png');
}

.container {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  background-image: url('@/assets/FondoPapel.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding-right: 3rem;

}

.card {
  width: 320px;
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
}


.history {
  font-size: 1.5rem;
  padding: 2rem;

  color: #90220A;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

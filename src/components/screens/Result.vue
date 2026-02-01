<template>
  <transition name="fade" mode="out-in" appear>
    <div class="screen" :key="resultType">
      <h1 class="title">{{ title }}</h1>

      <img
        class="result-image"
        :src="imageSrc"
        alt="Resultado"
      />

      <p class="subtitle">{{ subtitle }}</p>

      <button class="continue" @click="goHome">
        <img
          :src="buttonImage"
          alt="Continuar"
        />
      </button>

    </div>
  </transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const resultType = computed(() => route.query.result || 'defeat')

const subtitle = computed(() =>
  resultType.value === 'victory'
    ? 'Has encontrado al impostor'
    : 'El impostor no fue encontrado a tiempo'
)

const imageSrc = computed(() =>
  resultType.value === 'victory'
    ? new URL('@/assets/Background/FondoVictoria.png', import.meta.url).href
    : new URL('@/assets/Background/FondoDerrota.png', import.meta.url).href
)

const isHover = ref(false)

const buttonImage = computed(() =>
  isHover.value
    ? new URL('@/assets/Botones/BotonContinuar01.png', import.meta.url).href
    : new URL('@/assets/Botones/BotonContinuar01Hover.png', import.meta.url).href
)

const goHome = () => {
  router.push('/')
}
</script>


<style scoped>
.screen {
  min-height: 100vh;
  padding: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  background: #101018;
  color: white;
}

.result-image {
  width: min(105vw, 540px);
  margin: 1px 0;

  opacity: 0;
  animation: fade-up 1.4s ease forwards;
  animation-delay: 0.6s;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 36px;
  opacity: 0.85;

  opacity: 0;
  animation: fade-up 1.2s ease forwards;
  animation-delay: 1.3s;
}

.continue {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  opacity: 0;
  animation: fade-up 1.2s ease forwards;
  animation-delay: 2s;
}

.continue img {
  width: 220px;
  max-width: 80vw;
  transition: transform 0.2s ease;
}

.continue:hover img {
  transform: scale(1.03);
}


@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
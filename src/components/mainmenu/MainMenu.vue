<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentFrame = ref(0)
let interval: number | null = null

const frames = [
  new URL('@/assets/play/72px/play01.png', import.meta.url).href,
  new URL('@/assets/play/72px/play02.png', import.meta.url).href,
  new URL('@/assets/play/72px/play03.png', import.meta.url).href,
  new URL('@/assets/play/72px/play04.png', import.meta.url).href,
  new URL('@/assets/play/72px/play05.png', import.meta.url).href,
]

const startAnimation = () => {
  interval = window.setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % frames.length
  }, 90)
}

const goToSettings = () => {
  router.push('/settings')
}

onMounted(startAnimation)
</script>

<template>
  <div class="menu-container">
    <h1 class="title">
      Unmasked
    </h1>

    <button @click="goToSettings">
      <img :src="frames[currentFrame]" alt="Play"/>
    </button>

    <p class="history">
        Tienes que encontrar al impostor antes de que sea demasiado tarde...
    </p>
  </div>
</template>

<style scoped>
.menu-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  background: radial-gradient(circle at top, #0f172a, #020617);
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

button {
  background-color: transparent;
  border: none;
}
</style>

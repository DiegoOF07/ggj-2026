<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSettings = () => {
  router.push('/settings')
}
</script>

<template>
  <div class="menu-container">
    <h1 class="title">
      Unmasked
    </h1>

    <button class="play-btn" @click="goToSettings">
      <span class="material-symbols-outlined icon">play_arrow</span>
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

.play-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.icon {
  font-size: 1.6rem;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}
</style>

<template>
  <transition name="fade" mode="out-in" appear>
    <div class="screen" :key="resultType">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>

      <button class="continue" @click="goHome">
        Continuar
      </button>
    </div>
  </transition>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const resultType = computed(() => route.query.result || 'defeat')

const title = computed(() =>
  resultType.value === 'victory' ? 'Victoria' : 'Derrota'
)

const subtitle = computed(() =>
  resultType.value === 'victory'
    ? 'Has encontrado al impostor'
    : 'El impostor no fue encontrado a tiempo'
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

  background:
    linear-gradient(
      rgba(2, 6, 23, 0.55),
      rgba(2, 6, 23, 0.75)
    ),
    url('@/assets/Background/Background01.png');

  background-size: cover;
  background-position: center 65%;
  background-repeat: no-repeat;

  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.85;
}

.continue {
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 16px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #5B4B8A, #5B4B8A);
  color: white;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.continue:hover {
  filter: brightness(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>
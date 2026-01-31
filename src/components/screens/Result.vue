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
import { useRouter } from 'vue-router'

const resultType = 'defeat'

const router = useRouter()

const title = computed(() =>
  resultType === 'victory' ? 'Victoria' : 'Derrota'
)

const subtitle = computed(() =>
  resultType === 'victory'
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
}

/* Texto */
.title {
  font-size: 3rem;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 36px;
}

/* Botón */
.continue {
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 14px;
  border: none;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
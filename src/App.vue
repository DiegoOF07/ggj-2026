<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'

onMounted(async () => {
  await document.fonts.load('16px Harmonic')
})
</script>

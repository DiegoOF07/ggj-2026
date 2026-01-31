<template>
  <nav>
    <RouterLink to="/">Menu</RouterLink> |
    <RouterLink to="/settings">Settings</RouterLink> |
    <RouterLink to="/gameplay">Gameplay</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
nav {
  padding: 1rem;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-active {
  color: #42b883;
}
</style>

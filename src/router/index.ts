import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainMenu from '@/components/mainmenu/MainMenu.vue'
import GameSettings from '@/components/gamesettings/GameSettings.vue'
import Gameplay from '@/components/gameplay/Gameplay.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/settings',
    name: 'settings',
    component: GameSettings
  },
  {
    path: '/gameplay',
    name: 'gameplay',
    component: Gameplay
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

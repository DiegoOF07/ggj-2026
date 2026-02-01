import Gameplay from '../components/gameplay/Gameplay.vue'
import GameSettings from '../components/gamesettings/GameSettings.vue'
import MainMenu from '../components/mainmenu/MainMenu.vue'
import Result from '../components/screens/Result.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
  },
  {
    path: '/result',
    name: 'result',
    component: Result
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

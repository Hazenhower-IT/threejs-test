import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/Home.vue"
import Cube from "../components/Cube.vue"
import XrCube from "../components/XrCube.vue"
import XrCar from "../components/XrCar.vue"
import XrModelOverlay from "../components/XrModelOverlay.vue"
import SkyAndRain from "../components/SkyAndRain.vue"
import SkyBox from "../components/SkyBox.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/cube',
      name: 'cube',
      component: Cube
    },

    {
      path: '/xr-cube',
      name: 'xr-cube',
      component: XrCube
    },
    
    {
      path: '/xr-car',
      name: 'xr-car',
      component: XrCar
    },

    {
      path: '/xr-model-overlay',
      name: 'xr-model-overlay',
      component: XrModelOverlay
    },

    {
      path: '/sky-and-rain',
      name: 'sky-and-rain',
      component: SkyAndRain
    },

    {
      path: '/sky-box',
      name: 'sky-box',
      component: SkyBox
    },
  ]
})

export default router

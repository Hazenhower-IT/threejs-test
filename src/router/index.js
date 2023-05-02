import { createRouter, createWebHistory } from 'vue-router'
import Cube from "../components/Cube.vue"
import XrCube from "../components/XrCube.vue"
import XrCar from "../components/XrCar.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Cube
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
  ]
})

export default router

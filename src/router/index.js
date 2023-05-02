import { createRouter, createWebHistory } from 'vue-router'
import Cube from "../components/Cube.vue"
import XrCube from "../components/XrCube.vue"


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
    
  ]
})

export default router

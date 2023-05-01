import { createRouter, createWebHistory } from 'vue-router'
import Cube from "../components/Cube.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Cube
    },
    
  ]
})

export default router

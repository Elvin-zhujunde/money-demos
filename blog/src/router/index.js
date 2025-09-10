import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/travels',
    name: 'Travels',
    component: () => import('../views/Travels.vue')
  },
  {
    path: '/travel/:id',
    name: 'TravelDetail',
    component: () => import('../views/TravelDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
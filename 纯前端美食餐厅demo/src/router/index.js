import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/restaurants',
    name: 'RestaurantList',
    component: () => import('../views/RestaurantList.vue')
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetail',
    component: () => import('../views/RestaurantDetail.vue')
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('../views/UserCenter.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
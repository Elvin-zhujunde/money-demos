import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import ProfileInfo from '@/views/profile/ProfileInfo.vue'
import ProfileCollection from '@/views/profile/ProfileCollection.vue'
import CourseDetail from '@/views/CourseDetail.vue'
import CategoryCourses from '@/views/CategoryCourses.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    redirect: '/profile/info',
    children: [
      {
        path: 'info',
        name: 'ProfileInfo',
        component: ProfileInfo
      },
      {
        path: 'collection',
        name: 'ProfileCollection',
        component: ProfileCollection
      }
    ]
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    props: true
  },
  {
    path: '/category/:id',
    name: 'CategoryCourses',
    component: CategoryCourses,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 
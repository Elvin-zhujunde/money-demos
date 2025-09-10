import Vue from 'vue'
import VueRouter from 'vue-router'
import MySongs from '@/views/singer/MySongs.vue'
import store from '@/store'
import adminRoutes from './admin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout'),
    children: [
      {
        path: '/',
        name: 'Discover',
        component: () => import('@/views/discover'),
        meta: { title: '发现音乐' }
      },
      {
        path: '/playlist',
        name: 'Playlist',
        component: () => import('@/views/playlist/index.vue'),
        meta: { title: '歌单' }
      },
      {
        path: '/my-music',
        name: 'MyMusic',
        component: () => import('@/views/my-music'),
        meta: { title: '我的音乐' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile'),
        meta: { title: '个人主页' }
      },
      {
        path: '/song/:id',
        name: 'SongDetail',
        component: () => import('@/views/song/detail.vue')
      },
      {
        path: '/singer/songs',
        name: 'MySongs',
        component: MySongs,
        meta: {
          requiresAuth: true,
          requiresSinger: true
        }
      },
      {
        path: '/user/:id',
        name: 'UserProfile',
        component: () => import('@/views/profile'),
        meta: { title: '用户主页' }
      },
      {
        path: '/playlist/:id',
        name: 'PlaylistDetail',
        component: () => import('@/views/playlist/detail.vue'),
        meta: { title: '歌单详情' }
      }
    ]
  },
  ...adminRoutes
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isLogin = !!userInfo.id
  const isAdmin = userInfo.role === 'admin'


  // 如果已登录且是管理员,访问登录页则重定向到管理后台
  if (to.path === '/login' && isLogin && isAdmin) {
    next('/admin')
    return
  }

  next()
})

export default router 
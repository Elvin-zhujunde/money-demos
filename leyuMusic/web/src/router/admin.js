// 管理后台路由配置
export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/dashboard/index.vue'),
        meta: { title: '数据面板' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/users/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'songs',
        name: 'AdminSongs',
        component: () => import('@/views/admin/songs/index.vue'),
        meta: { title: '歌曲管理' }
      },
      {
        path: 'playlists',
        name: 'AdminPlaylists',
        component: () => import('@/views/admin/playlists/index.vue'),
        meta: { title: '歌单管理' }
      }
    ]
  }
] 
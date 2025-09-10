import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Layout.vue'),
    meta: { requiresAuth: true, adminAccess: true },
    children: [
      {
        path: 'activities',
        name: 'ActivityManagement',
        component: () => import('../views/admin/ActivityManagement.vue')
      },
      {
        path: 'activities/create',
        name: 'ActivityCreate',
        component: () => import('../views/admin/ActivityCreate.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/admin/UserManagement.vue')
      }
    ]
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('../views/activities/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetail',
    component: () => import('../views/activities/Detail.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login');
  } else if (to.meta.adminAccess && !userStore.isAdmin) {
    if (userStore.userInfo?.role === 2) {
      next('/admin/users'); // 超级管理员默认进入用户管理页面
    } else if (userStore.userInfo?.role === 1) {
      next('/admin/activities'); // 管理员默认进入活动管理页面
    } else {
      next('/activities'); // 志愿者进入活动列表页面
    }
  } else {
    next();
  }
});

export default router; 
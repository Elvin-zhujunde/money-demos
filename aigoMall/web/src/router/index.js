import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/index.vue')
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue')
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/checkout/index.vue')
      },
      {
        path: 'order/:orderNo',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue')
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/seller',
    component: () => import('@/views/seller/layout.vue'),
    redirect: '/seller/products',
    meta: { requiresAuth: true, requiresRole: 1 },
    children: [
      {
        path: 'products',
        name: 'SellerProducts',
        component: () => import('@/views/seller/products.vue')
      },
      {
        path: 'orders',
        name: 'SellerOrders',
        component: () => import('@/views/seller/orders.vue')
      },
      {
        path: 'users',
        name: 'SellerUsers',
        component: () => import('@/views/seller/users')
      },
      {
        path: 'banners',
        name: 'SellerBanners',
        component: () => import('@/views/seller/banners')
      },
      {
        path: 'categories',
        name: 'SellerCategories',
        component: () => import('@/views/seller/categories')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/home', '/login']
  
  let needAuth = !publicPages.includes(to.path)
  if (to.path.startsWith('/product')) {
    needAuth = false
  }

  const userInfo = localStorage.getItem('userInfo')

  if (needAuth && !userInfo) {
    next('/login')
    return
  }

  if (to.meta.requiresRole) {
    const user = JSON.parse(userInfo || '{}')
    if (user.role !== to.meta.requiresRole) {
      next('/home')
      return
    }
  }

  next()
})

export default router

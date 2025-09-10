<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="admin-logo">
          <el-icon><ShoppingBag /></el-icon>
          <span>后台管理系统</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          router
        >
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/products">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/orders">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header>
          <div class="header-content">
            <div class="breadcrumb">
              <el-breadcrumb>
                <el-breadcrumb-item>后台管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="user-info">
              <el-dropdown @command="handleCommand">
                <span class="user-dropdown">
                  {{ userInfo.username }}
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="home">返回商城</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingBag, User, Goods, List, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const userInfo = computed(() => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : {}
})

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/admin/users': '用户管理',
    '/admin/products': '商品管理',
    '/admin/orders': '订单管理'
  }
  return titles[route.path] || ''
})

const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/')
      break
    case 'logout':
      localStorage.removeItem('user')
      router.push('/login')
      ElMessage.success('已退出登录')
      break
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.admin-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  gap: 8px;
  border-bottom: 1px solid #eee;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #eee;
}

.admin-menu {
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
}

.header-content {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
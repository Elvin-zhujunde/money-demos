<template>
  <el-container>
    <el-header>
      <div class="nav-container">
        <div class="logo">
          <router-link to="/">美食点评</router-link>
        </div>
        <nav class="nav-menu">
          <router-link to="/" active-class="active">首页</router-link>
          <router-link to="/restaurants" active-class="active">餐厅列表</router-link>
        </nav>
        <div class="user-menu">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
                <span class="username">{{ userStore.userInfo?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToUserCenter">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <router-link v-else to="/login" class="login-btn">
            <el-button type="primary">登录</el-button>
          </router-link>
        </div>
      </div>
    </el-header>
    
    <el-main>
      <router-view></router-view>
    </el-main>
    
    <el-footer>
      <p>© 2023 美食点评网</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { useUserStore } from './store/user'
import { useRouter } from 'vue-router'
import { ArrowDown, User, SwitchButton } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const goToUserCenter = () => {
  router.push('/user')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo a {
  color: #409EFF;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-menu a {
  color: #606266;
  text-decoration: none;
  font-size: 16px;
  position: relative;
  padding: 0 4px;
}

.nav-menu a.active,
.nav-menu a:hover {
  color: #409EFF;
}

.nav-menu a.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: fixed;
  width: 100%;
  z-index: 100;
}

.el-main {
  padding-top: 80px;
  min-height: calc(100vh - 120px);
}

.el-footer {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style> 
<template>
  <div class="user-info">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="user-name" @click="router.push('/profile')">{{ userStore.userInfo.name }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="角色">{{ getRoleText(userStore.userInfo.role) }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ userStore.userInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userStore.userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ userStore.userInfo.address }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const getRoleText = (role) => {
  const texts = {
    0: '志愿者',
    1: '管理员',
    2: '超级管理员'
  }
  return texts[role]
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-info {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  cursor: pointer;
  color: #409EFF;
}

.user-name:hover {
  text-decoration: underline;
}
</style> 
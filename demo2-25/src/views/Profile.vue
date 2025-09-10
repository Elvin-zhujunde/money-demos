<template>
  <div class="profile">
    <div class="profile-tabs">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="info" tab="个人信息" />
        <a-tab-pane key="collection" tab="我的收藏" />
      </a-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeTab = ref('info')

// 根据路由路径设置当前激活的标签
watch(() => route.path, (newPath) => {
  if (newPath.includes('/info')) {
    activeTab.value = 'info'
  } else if (newPath.includes('/collection')) {
    activeTab.value = 'collection'
  }
}, { immediate: true })

// 处理标签切换
const handleTabChange = (key) => {
  router.push(`/profile/${key}`)
}
</script>

<style lang="less" scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .profile-tabs {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}
</style> 
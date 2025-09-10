<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const selectedKeys = ref([route.path.replace('/', '') || 'home']);

const handleTabChange = (key) => {
  router.push(`/${key}`);
  selectedKeys.value = [key];
};
</script>

<template>
  <a-layout class="layout">
    <!-- 顶部导航 -->
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo" style="cursor: pointer;" @click="router.push('/')">课程平台</div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          class="nav-menu"
        >
          <a-menu-item key="home" @click="handleTabChange('home')">
            首页
          </a-menu-item>
          <a-menu-item key="profile" @click="handleTabChange('profile')">
            我的
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-header>

    <!-- 内容区域 -->
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<style lang="less" scoped>
.layout {
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 24px;

    .logo {
      font-size: 20px;
      font-weight: bold;
    }

    .nav-menu {
      border-bottom: none;
      background: transparent;
    }
  }
}

.content {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

// 响应式设计
@media screen and (max-width: 768px) {
  .header .header-content {
    padding: 0 16px;
  }
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}

::-webkit-scrollbar {
  display: none;
}
</style>

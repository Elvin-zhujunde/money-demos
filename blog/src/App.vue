<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <el-container>
    <el-header>
      <NavBar />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
    <el-footer>
      <p>&copy; 2024 技术博客. 保留所有权利.</p>
    </el-footer>
  </el-container>
</template>

<style scoped>
.el-container {
  min-height: 100vh;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-footer {
  text-align: center;
  padding: 20px;
  background-color: #f5f7fa;
}
</style>

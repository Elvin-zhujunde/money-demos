<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('1')

const navItems = [
  { index: '1', path: '/', label: '首页' },
  { index: '2', path: '/travels', label: '游记' }
]

const handleSelect = (key) => {
  const item = navItems.find(item => item.index === key)
  if (item) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="nav-menu"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item v-for="item in navItems" :key="item.index" :index="item.index">
      {{ item.label }}
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.nav-menu {
  justify-content: center;
}
</style> 
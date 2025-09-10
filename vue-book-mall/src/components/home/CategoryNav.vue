<template>
  <div class="category-nav">
    <el-menu mode="horizontal" :router="true">
      <el-menu-item 
        v-for="category in categories" 
        :key="category.id"
        :index="`/category?id=${category.id}`"
      >
        <el-icon><component :is="category.icon" /></el-icon>
        <span>{{ category.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

const fetchCategories = async () => {
  try {
    const { data } = await axios.get('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-nav {
  margin: 20px 0;
}
</style> 
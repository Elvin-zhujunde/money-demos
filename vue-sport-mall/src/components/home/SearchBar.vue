<template>
  <div class="search-bar">
    <el-input
      v-model="searchText"
      placeholder="搜索商品"
      class="search-input"
      :prefix-icon="Search"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-button @click="handleSearch">搜索</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchText = ref('')

const handleSearch = () => {
  if (searchText.value.trim()) {
    router.push({
      path: '/category',
      query: { keyword: searchText.value }
    })
  }
}
</script>

<style scoped>
.search-bar {
  max-width: 600px;
  margin: 20px auto;
}
</style> 
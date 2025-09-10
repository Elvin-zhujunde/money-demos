<template>
  <div class="category-page">
    <el-container>
      <!-- 左侧分类导航 -->
      <el-aside width="240px">
        <div class="category-nav">
          <h3>商品分类</h3>
          <el-menu
            :default-active="currentCategory.toString()"
            class="category-menu"
            @select="handleCategoryChange"
          >
            <el-menu-item index="0">
              <el-icon><Grid /></el-icon>
              <span>全部商品</span>
            </el-menu-item>
            <el-menu-item 
              v-for="category in categories" 
              :key="category.id"
              :index="category.id.toString()"
            >
              <el-icon><component :is="category.icon" /></el-icon>
              <span>{{ category.name }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <!-- 右侧商品列表 -->
      <el-main>
        <div class="category-header">
          <h2>{{ currentCategoryName }}</h2>
          <p class="category-description">{{ currentCategoryDescription }}</p>
        </div>
        <product-list :products="products" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Grid } from '@element-plus/icons-vue'
import axios from 'axios'
import ProductList from '@/components/category/ProductList.vue'

const route = useRoute()
const router = useRouter()

// 状态管理
const categories = ref([])
const products = ref([])
const currentCategory = ref(Number(route.query.id) || 0)

// 计算当前分类名称和描述
const currentCategoryName = computed(() => {
  if (currentCategory.value === 0) return '全部商品'
  const category = categories.value.find(c => c.id === currentCategory.value)
  return category ? category.name : '全部商品'
})

const currentCategoryDescription = computed(() => {
  if (currentCategory.value === 0) return '浏览所有商品'
  const category = categories.value.find(c => c.id === currentCategory.value)
  return category ? category.description : ''
})

// 获取分类数据
const fetchCategories = async () => {
  try {
    const { data } = await axios.get('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取商品数据
const fetchProducts = async () => {
  try {
    let url = '/api/products'
    const params = new URLSearchParams()
    
    if (currentCategory.value) {
      params.append('categoryId', currentCategory.value)
    }
    
    const { data } = await axios.get(`${url}?${params.toString()}`)
    products.value = data
  } catch (error) {
    console.error('获取商品失败:', error)
  }
}

// 事件处理
const handleCategoryChange = (categoryId) => {
  currentCategory.value = Number(categoryId)
  router.push({ 
    query: { 
      id: categoryId === '0' ? undefined : categoryId 
    }
  })
  fetchProducts()
}

// 生命周期钩子
onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.category-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.category-nav {
  background: #fff;
  border-radius: 4px;
  padding: 20px 0;
}

.category-nav h3 {
  padding: 0 20px;
  margin-bottom: 20px;
  color: #303133;
}

.category-menu {
  border-right: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 10px;
}

.category-header {
  margin-bottom: 30px;
}

.category-header h2 {
  margin-bottom: 10px;
  color: #303133;
}

.category-description {
  color: #909399;
  font-size: 14px;
}

:deep(.el-main) {
  padding: 0 20px 20px 20px;
  background: #fff;
  border-radius: 4px;
  margin-left: 20px;
}

:deep(.el-aside) {
  background: #fff;
  border-radius: 4px;
}
</style>

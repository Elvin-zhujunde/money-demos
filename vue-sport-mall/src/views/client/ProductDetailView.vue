<template>
  <div class="product-detail">
    <el-card class="detail-card">
      <el-row :gutter="40">
        <!-- 商品图片 -->
        <el-col :span="12">
          <div class="image-container">
            <el-image :src="product.image" fit="cover" />
          </div>
        </el-col>

        <!-- 商品信息 -->
        <el-col :span="12">
          <div class="info-container">
            <h1 class="title">{{ product.title }}</h1>
            
            <div class="category">
              <el-tag>{{ categoryName }}</el-tag>
            </div>

            <div class="price-section">
              <span class="price-label">价格：</span>
              <span class="price">¥{{ product.price }}</span>
            </div>

            <div class="sales-section">
              <span>库存: {{ product.stock }}</span>
              <span class="divider">|</span>
              <span>销量: {{ product.sales }}</span>
            </div>

            <div class="description">
              <h3>商品描述</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="action-section">
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="product.stock"
                size="large"
              />
              <el-button 
                type="primary" 
                size="large" 
                :loading="loading"
                :disabled="!isLoggedIn"
                @click="handleAddToCart"
              >
                加入购物车
              </el-button>
              <el-button 
                type="danger" 
                size="large" 
                plain
                :disabled="!isLoggedIn"
                @click="handleBuyNow"
              >
                立即购买
              </el-button>
            </div>

            <div class="tips" v-if="!isLoggedIn">
              <el-alert
                title="请先登录后再进行购买"
                type="warning"
                :closable="false"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const product = ref({})
const category = ref({})
const quantity = ref(1)

// 获取用户登录状态
const isLoggedIn = computed(() => {
  const userStr = localStorage.getItem('user')
  return !!userStr
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// 获取分类名称
const categoryName = computed(() => {
  return category.value?.name || ''
})

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    const { data } = await axios.get(`/api/products/${route.params.id}`)
    product.value = data
    
    // 获取分类信息
    const { data: categoryData } = await axios.get(`/api/categories/${data.categoryId}`)
    category.value = categoryData
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  }
}

// 添加到购物车
const handleAddToCart = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const user = getUserInfo()
    
    // 检查购物车是否已有该商品
    const { data: existingItems } = await axios.get(`/api/cart`, {
      params: {
        userId: user.id,
        productId: product.value.id
      }
    })

    if (existingItems.length > 0) {
      // 更新数量
      const item = existingItems[0]
      await axios.patch(`/api/cart/${item.id}`, {
        quantity: item.quantity + quantity.value
      })
    } else {
      // 新增购物车项
      await axios.post('/api/cart', {
        userId: user.id,
        productId: product.value.id,
        quantity: quantity.value,
        selected: true,
        createTime: new Date().toISOString()
      })
    }

    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加购物车失败:', error)
    ElMessage.error('添加购物车失败')
  } finally {
    loading.value = false
  }
}

// 立即购买
const handleBuyNow = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  // 添加到购物车并跳转
  await handleAddToCart()
  router.push('/cart')
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.detail-card {
  padding: 20px;
}

.image-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.image-container :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.info-container {
  padding: 20px 0;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
}

.category {
  margin-bottom: 20px;
}

.price-section {
  margin: 20px 0;
  font-size: 16px;
}

.price-label {
  color: #909399;
}

.price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
}

.sales-section {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
}

.divider {
  margin: 0 10px;
}

.description {
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.description h3 {
  color: #303133;
  margin-bottom: 10px;
}

.description p {
  color: #606266;
  line-height: 1.6;
}

.action-section {
  margin: 30px 0;
  display: flex;
  gap: 20px;
  align-items: center;
}

.tips {
  margin-top: 20px;
}
</style> 
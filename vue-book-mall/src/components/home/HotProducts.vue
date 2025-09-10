<template>
  <div class="hot-products">
    <h2>热门商品</h2>
    <el-row :gutter="20">
      <el-col 
        v-for="product in hotProducts" 
        :key="product.id" 
        :xs="24" 
        :sm="12" 
        :md="8" 
        :lg="6"
      >
        <el-card :body-style="{ padding: '0px' }" class="product-card">
          <img :src="product.image" class="product-image">
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p class="price">¥ {{ product.price }}</p>
            <el-button type="primary" @click="goToDetail(product.id)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const hotProducts = ref([])

const fetchHotProducts = async () => {
  try {
    const { data } = await axios.get('/api/products?isHot=true')
    hotProducts.value = data
  } catch (error) {
    console.error('获取热门商品失败:', error)
  }
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  fetchHotProducts()
})
</script>

<style scoped>
.hot-products {
  margin: 40px 0;
}
.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-info {
  padding: 14px;
}
.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}
</style> 
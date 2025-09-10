<template>
  <div class="restaurant-detail">
    <div class="header">
      <el-image :src="restaurant.image" fit="cover" class="banner"/>
      <div class="info-card">
        <h1>{{ restaurant.name }}</h1>
        <div class="basic-info">
          <el-rate v-model="restaurant.rating" disabled></el-rate>
          <span class="price">人均: ¥{{ restaurant.averagePrice }}</span>
          <span class="address">{{ restaurant.address }}</span>
        </div>
      </div>
    </div>

    <div class="content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="菜品" name="menu">
          <div class="menu-list">
            <el-row :gutter="20">
              <el-col :span="6" v-for="dish in restaurant.menu" :key="dish.id">
                <el-card>
                  <img :src="dish.image" class="dish-image">
                  <div class="dish-info">
                    <h3>{{ dish.name }}</h3>
                    <p class="price">¥{{ dish.price }}</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="评价" name="reviews">
          <div class="reviews">
            <div v-for="review in restaurant.reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <el-avatar :src="review.userAvatar"></el-avatar>
                <span class="username">{{ review.username }}</span>
                <el-rate v-model="review.rating" disabled></el-rate>
              </div>
              <p class="review-content">{{ review.content }}</p>
              <div class="review-images" v-if="review.images">
                <el-image 
                  v-for="img in review.images" 
                  :key="img"
                  :src="img"
                  :preview-src-list="review.images"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('menu')

const restaurant = ref({
  id: 1,
  name: '江南小馆',
  rating: 4.5,
  averagePrice: 88,
  address: '上海市黄浦区南京东路123号',
  image: 'https://via.placeholder.com/800x400?text=Restaurant1',
  menu: [
    {
      id: 1,
      name: '红烧狮子头',
      price: 48,
      image: 'https://via.placeholder.com/400x300?text=Dish1'
    }
  ],
  reviews: [
    {
      id: 1,
      username: '美食家',
      userAvatar: 'https://via.placeholder.com/100x100?text=User1',
      rating: 5,
      content: '菜品非常美味,环境优雅,服务态度很好',
      images: [
        'https://via.placeholder.com/400x300?text=Review1',
        'https://via.placeholder.com/400x300?text=Review2'
      ]
    }
  ]
})
</script>

<style scoped>
.restaurant-detail {
  min-height: 100vh;
}

.header {
  position: relative;
  height: 300px;
}

.banner {
  width: 100%;
  height: 100%;
}

.info-card {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255,255,255,0.9);
  padding: 20px;
  border-radius: 8px;
}

.basic-info {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.content {
  padding: 20px;
}

.dish-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.dish-info {
  padding: 10px;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.review-images .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}
</style> 
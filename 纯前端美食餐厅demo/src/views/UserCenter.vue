<template>
  <div class="user-center">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="user-info">
          <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.bio }}</p>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的收藏" name="favorites">
            <el-row :gutter="20">
              <el-col :span="8" v-for="item in favorites" :key="item.id">
                <el-card @click="goToRestaurant(item.id)">
                  <img :src="item.image" class="restaurant-image">
                  <div class="restaurant-info">
                    <h3>{{ item.name }}</h3>
                    <el-rate v-model="item.rating" disabled></el-rate>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="我的评价" name="reviews">
            <div class="review-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <h3>{{ review.restaurantName }}</h3>
                <el-rate v-model="review.rating" disabled></el-rate>
                <p>{{ review.content }}</p>
                <div class="review-images">
                  <el-image 
                    v-for="img in review.images" 
                    :key="img"
                    :src="img"
                    :preview-src-list="review.images"
                  />
                </div>
                <span class="review-date">{{ review.date }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('favorites')

const userInfo = ref({
  username: '美食达人',
  avatar: 'https://via.placeholder.com/100x100?text=Avatar',
  bio: '热爱美食,热爱生活'
})

const favorites = ref([
  {
    id: 1,
    name: '江南小馆',
    rating: 4.5,
    image: 'https://via.placeholder.com/800x400?text=Restaurant1'
  }
])

const reviews = ref([
  {
    id: 1,
    restaurantName: '江南小馆',
    rating: 5,
    content: '菜品非常美味,环境优雅',
    images: [
      'https://via.placeholder.com/400x300?text=Review1',
      'https://via.placeholder.com/400x300?text=Review2'
    ],
    date: '2023-08-01'
  }
])

const goToRestaurant = (id) => {
  router.push(`/restaurant/${id}`)
}
</script>

<style scoped>
.user-center {
  padding: 20px;
}

.user-info {
  text-align: center;
  padding: 20px;
}

.restaurant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.restaurant-info {
  padding: 14px;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.review-images {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.review-images .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.review-date {
  color: #999;
  font-size: 14px;
}
</style> 
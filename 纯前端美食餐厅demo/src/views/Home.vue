<template>
  <div class="home">
    <el-carousel height="500px" class="banner" indicator-position="outside">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner-content" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-text">
            <h1>{{ item.title }}</h1>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="content">
      <div class="section categories">
        <div class="section-header">
          <h2>美食分类</h2>
        </div>
        <el-row :gutter="20">
          <el-col :span="6" v-for="category in categories" :key="category.name">
            <div class="category-card" @click="filterByCategory(category.name)">
              <el-icon class="category-icon">
                <component :is="category.icon" />
              </el-icon>
              <span>{{ category.name }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="section recommended">
        <div class="section-header">
          <h2>推荐餐厅</h2>
          <router-link to="/restaurants" class="more">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <el-row :gutter="20">
          <el-col 
            :xs="24" :sm="12" :md="8" :lg="6" 
            v-for="restaurant in recommendedRestaurants" 
            :key="restaurant.id"
          >
            <RestaurantCard 
              :restaurant="restaurant"
              @click="goToDetail(restaurant.id)"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Bowl,
  ForkSpoon,
  Coffee,
  IceCream
} from '@element-plus/icons-vue'
import RestaurantCard from '@/components/RestaurantCard.vue'
import { recommendedRestaurants as mockRestaurants } from '@/mock/restaurants'

const router = useRouter()

const banners = ref([
  { 
    id: 1, 
    image: 'https://via.placeholder.com/1920x500?text=Banner1', 
    title: '探索美食世界',
    description: '发现城市里最地道的美味'
  },
  { 
    id: 2, 
    image: 'https://via.placeholder.com/1920x500?text=Banner2', 
    title: '特色餐厅精选',
    description: '精心挑选的高品质餐厅'
  }
])

const categories = ref([
  { name: '中餐', icon: Bowl },
  { name: '西餐', icon: ForkSpoon },
  { name: '咖啡', icon: Coffee },
  { name: '甜点', icon: IceCream }
])

const recommendedRestaurants = ref(mockRestaurants)

const goToDetail = (id) => {
  router.push(`/restaurant/${id}`)
}

const filterByCategory = (category) => {
  router.push({
    path: '/restaurants',
    query: { category }
  })
}
</script>

<style scoped>
.banner {
  margin-bottom: 60px;
}

.banner-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10%;
}

.banner-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
}

.banner-text {
  position: relative;
  color: white;
  max-width: 500px;
}

.banner-text h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner-text p {
  font-size: 20px;
  opacity: 0.9;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.more {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
  text-decoration: none;
}

h2 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.category-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  background: #ecf5ff;
  transform: translateY(-5px);
}

.category-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 10px;
}

:deep(.el-carousel__indicators) {
  transform: translateY(20px);
}

:deep(.el-carousel__button) {
  width: 30px;
  border-radius: 15px;
}
</style> 
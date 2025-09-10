<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../store/travel'
import TravelCard from '../components/TravelCard.vue'

const store = useTravelStore()
const { featuredTravels } = storeToRefs(store)

onMounted(async () => {
  await store.fetchTravels()
})
</script>

<template>
  <div class="home">
    <div class="banner">
      <div class="banner-content">
        <h1>分享你的旅行故事</h1>
        <p>记录精彩瞬间，传递旅行感动</p>
        <el-button type="primary" size="large" class="cta-button">
          开始写游记
        </el-button>
      </div>
    </div>

    <div class="categories">
      <el-row :gutter="20">
        <el-col :span="8" v-for="category in ['文化探索', '人文风光', '海岛度假']" :key="category">
          <div class="category-card">
            <el-icon size="24px" class="category-icon">
              <component :is="getCategoryIcon(category)" />
            </el-icon>
            <h3>{{ category }}</h3>
            <p>{{ getCategoryDesc(category) }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="featured-section">
      <div class="section-header">
        <h2>精选游记</h2>
        <p>发现更多精彩旅行故事</p>
      </div>
      <el-row :gutter="20">
        <el-col 
          v-for="travel in featuredTravels" 
          :key="travel.id"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <TravelCard :travel="travel" />
        </el-col>
      </el-row>
    </div>

    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-card">
            <h3>1000+</h3>
            <p>精选游记</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <h3>50+</h3>
            <p>目的地</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <h3>10000+</h3>
            <p>旅行者</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.banner {
  text-align: center;
  padding: 120px 0;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('https://picsum.photos/1920/1080?random=0') center/cover;
  color: white;
  margin: -20px -20px 40px -20px;
  position: relative;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner h1 {
  font-size: 3em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.banner p {
  font-size: 1.4em;
  opacity: 0.9;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.cta-button {
  padding: 15px 40px;
  font-size: 1.2em;
}

.categories {
  margin: 60px auto;
  max-width: 1200px;
}

.category-card {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-icon {
  color: var(--el-color-primary);
  margin-bottom: 15px;
}

.category-card h3 {
  margin: 15px 0;
  font-size: 1.4em;
}

.category-card p {
  color: #666;
  line-height: 1.6;
}

.featured-section {
  max-width: 1200px;
  margin: 60px auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 10px;
}

.section-header p {
  color: #666;
  font-size: 1.1em;
}

.stats-section {
  background: #f8f9fa;
  padding: 60px 20px;
  margin: 60px -20px -20px -20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-card h3 {
  font-size: 2.5em;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}

.stat-card p {
  color: #666;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .banner {
    padding: 80px 20px;
  }

  .banner h1 {
    font-size: 2em;
  }

  .banner p {
    font-size: 1.1em;
  }

  .category-card {
    margin-bottom: 20px;
  }

  .stat-card {
    margin-bottom: 30px;
  }
}
</style>

<script>
// 在 setup 函数之外定义辅助函数
function getCategoryIcon(category) {
  switch (category) {
    case '文化探索':
      return 'Collection'
    case '人文风光':
      return 'Camera'
    case '海岛度假':
      return 'Sunny'
    default:
      return 'Location'
  }
}

function getCategoryDesc(category) {
  switch (category) {
    case '文化探索':
      return '深入体验当地文化，探索历史古迹'
    case '人文风光':
      return '记录自然与人文的完美融合'
    case '海岛度假':
      return '享受阳光、沙滩与海洋的美好时光'
    default:
      return ''
  }
}
</script> 
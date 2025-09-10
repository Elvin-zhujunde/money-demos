<template>
  <el-card 
    class="restaurant-card" 
    :body-style="{ padding: '0px' }"
    @click="$emit('click')"
  >
    <div class="image-wrapper">
      <img 
        v-lazyload="restaurant.image" 
        class="restaurant-image"
        src="https://via.placeholder.com/800x400?text=Loading"
        :alt="restaurant.name"
      >
      <div class="tags">
        <el-tag 
          v-for="tag in restaurant.tags" 
          :key="tag"
          size="small"
          effect="dark"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
    <div class="restaurant-info">
      <div class="header">
        <h3>{{ restaurant.name }}</h3>
        <span class="price">¥{{ restaurant.averagePrice }}/人</span>
      </div>
      <p class="cuisine">{{ restaurant.cuisine }}</p>
      <div class="footer">
        <RatingStars :model-value="restaurant.rating" />
        <div class="features">
          <el-tooltip 
            v-for="feature in restaurant.features" 
            :key="feature"
            :content="feature"
            placement="top"
          >
            <el-icon class="feature-icon">
              <component :is="getFeatureIcon(feature)" />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import {
  Edit,
  Van,
  Box,
  Moon,
  Goblet
} from '@element-plus/icons-vue'
import RatingStars from './RatingStars.vue'

defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})

const getFeatureIcon = (feature) => {
  const iconMap = {
    '提供wifi': Edit,
    '免费停车': Van,
    '包厢': Box,
    '深夜营业': Moon,
    '露台餐位': Goblet
  }
  return iconMap[feature]
}
</script>

<style scoped>
.restaurant-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.restaurant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.05);
}

.tags {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.restaurant-info {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.cuisine {
  color: #666;
  margin: 8px 0;
  font-size: 14px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.price {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 16px;
}

.features {
  display: flex;
  gap: 8px;
}

.feature-icon {
  color: #909399;
  font-size: 16px;
}

:deep(.el-tag) {
  border: none;
  background: rgba(0,0,0,0.5);
}
</style> 
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { View, Star, Location } from '@element-plus/icons-vue'

const props = defineProps({
  travel: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleViewDetail = () => {
  router.push(`/travel/${props.travel.id}`)
}
</script>

<template>
  <el-card class="travel-card" :body-style="{ padding: '0px' }">
    <div class="image-wrapper">
      <img :src="travel.coverImage" class="travel-image">
      <div class="category-tag">{{ travel.category }}</div>
    </div>
    <div class="travel-info">
      <div class="location">
        <el-icon><Location /></el-icon>
        {{ travel.location }}
      </div>
      <h3 class="title">{{ travel.title }}</h3>
      <p class="summary">{{ travel.summary }}</p>
      <div class="meta">
        <div class="author-info">
          <span class="author">{{ travel.author }}</span>
          <span class="date">{{ travel.date }}</span>
        </div>
        <div class="stats">
          <span class="stat-item">
            <el-icon><View /></el-icon>
            {{ travel.views }}
          </span>
          <span class="stat-item">
            <el-icon><Star /></el-icon>
            {{ travel.likes }}
          </span>
        </div>
      </div>
      <el-button 
        type="primary" 
        class="read-more" 
        @click="handleViewDetail"
      >
        阅读全文
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.travel-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.travel-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.travel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.travel-card:hover .travel-image {
  transform: scale(1.05);
}

.category-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9em;
}

.travel-info {
  padding: 16px;
}

.location {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 1.2em;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.summary {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author {
  color: #333;
  font-weight: 500;
}

.date {
  color: #999;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.read-more {
  width: 100%;
}

.el-icon {
  margin-right: 2px;
}

@media (max-width: 768px) {
  .image-wrapper {
    height: 180px;
  }
}
</style> 
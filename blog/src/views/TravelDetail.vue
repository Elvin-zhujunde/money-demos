<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTravelStore } from '../store/travel'

const route = useRoute()
const store = useTravelStore()
const travel = ref(null)

onMounted(async () => {
  travel.value = await store.fetchTravelById(route.params.id)
})
</script>

<template>
  <div v-if="travel" class="travel-detail">
    <div class="header">
      <h1>{{ travel.title }}</h1>
      <div class="meta">
        <span>作者：{{ travel.author }}</span>
        <span>发布时间：{{ travel.date }}</span>
        <span>
          <el-icon><View /></el-icon> {{ travel.views }}
          <el-icon><Star /></el-icon> {{ travel.likes }}
        </span>
      </div>
    </div>

    <div class="cover">
      <img :src="travel.coverImage" :alt="travel.title">
    </div>

    <div class="content">
      {{ travel.content }}
    </div>

    <div class="gallery">
      <h2>图片集</h2>
      <el-row :gutter="20">
        <el-col 
          v-for="(image, index) in travel.images" 
          :key="index"
          :span="8"
        >
          <el-image 
            :src="image" 
            :preview-src-list="travel.images"
            fit="cover"
            class="gallery-image"
          />
        </el-col>
      </el-row>
    </div>
  </div>
  <div v-else class="loading">
    <el-skeleton :rows="10" animated />
  </div>
</template>

<style scoped>
.travel-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.meta {
  color: #666;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.cover {
  margin-bottom: 30px;
}

.cover img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.content {
  line-height: 1.8;
  color: #333;
  margin-bottom: 40px;
}

.gallery {
  margin-top: 40px;
}

.gallery h2 {
  text-align: center;
  margin-bottom: 20px;
}

.gallery-image {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.loading {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
</style> 
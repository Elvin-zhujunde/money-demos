<template>
  <div class="restaurant-list">
    <div class="filters">
      <el-card class="filter-card">
        <div class="filter-group">
          <span class="filter-label">菜系:</span>
          <el-radio-group v-model="filters.cuisine">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button 
              v-for="item in cuisineOptions" 
              :key="item.value" 
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">价格:</span>
          <el-radio-group v-model="filters.priceRange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button 
              v-for="item in priceOptions" 
              :key="item.value" 
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="filter-group">
          <span class="filter-label">特色:</span>
          <el-checkbox-group v-model="filters.features">
            <el-checkbox-button label="wifi">WiFi</el-checkbox-button>
            <el-checkbox-button label="parking">停车</el-checkbox-button>
            <el-checkbox-button label="private">包厢</el-checkbox-button>
            <el-checkbox-button label="outdoor">露台</el-checkbox-button>
          </el-checkbox-group>
        </div>

        <div class="filter-group">
          <span class="filter-label">排序:</span>
          <el-radio-group v-model="filters.sort">
            <el-radio-button label="rating">评分最高</el-radio-button>
            <el-radio-button label="price-asc">价格从低到高</el-radio-button>
            <el-radio-button label="price-desc">价格从高到低</el-radio-button>
          </el-radio-group>
        </div>
      </el-card>
    </div>

    <div class="content">
      <el-row :gutter="20">
        <el-col 
          :xs="24" :sm="12" :md="8" :lg="6" 
          v-for="restaurant in filteredRestaurants" 
          :key="restaurant.id"
        >
          <RestaurantCard 
            :restaurant="restaurant"
            @click="goToDetail(restaurant.id)"
          />
        </el-col>
      </el-row>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="12"
          :total="totalRestaurants"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RestaurantCard from '@/components/RestaurantCard.vue'
import { recommendedRestaurants } from '@/mock/restaurants'

const router = useRouter()
const route = useRoute()

const filters = ref({
  cuisine: route.query.category || '',
  priceRange: '',
  features: [],
  sort: 'rating'
})

const currentPage = ref(1)
const totalRestaurants = ref(100)

const cuisineOptions = [
  { value: 'chinese', label: '中餐' },
  { value: 'japanese', label: '日料' },
  { value: 'western', label: '西餐' },
  { value: 'korean', label: '韩餐' }
]

const priceOptions = [
  { value: '0-50', label: '¥50以下' },
  { value: '50-100', label: '¥50-100' },
  { value: '100-300', label: '¥100-300' },
  { value: '300+', label: '¥300以上' }
]

// 模拟筛选逻辑
const filteredRestaurants = computed(() => {
  let result = [...recommendedRestaurants]
  
  if (filters.value.cuisine) {
    result = result.filter(r => r.cuisine.includes(filters.value.cuisine))
  }
  
  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.split('-')
    result = result.filter(r => {
      if (max === '+') return r.averagePrice >= Number(min)
      return r.averagePrice >= Number(min) && r.averagePrice <= Number(max)
    })
  }

  if (filters.value.features.length) {
    result = result.filter(r => 
      filters.value.features.every(f => r.features.some(rf => rf.includes(f)))
    )
  }

  switch (filters.value.sort) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'price-asc':
      result.sort((a, b) => a.averagePrice - b.averagePrice)
      break
    case 'price-desc':
      result.sort((a, b) => b.averagePrice - a.averagePrice)
      break
  }

  return result
})

const goToDetail = (id) => {
  router.push(`/restaurant/${id}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 这里应该调用API获取对应页码的数据
}
</script>

<style scoped>
.restaurant-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filters {
  margin-bottom: 30px;
}

.filter-card {
  padding: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  width: 60px;
  color: #606266;
  font-size: 14px;
}

.content {
  margin-bottom: 40px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

:deep(.el-radio-button__inner) {
  padding: 8px 15px;
}

:deep(.el-checkbox-button__inner) {
  padding: 8px 15px;
}
</style> 
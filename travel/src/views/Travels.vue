<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../store/travel'
import TravelCard from '../components/TravelCard.vue'
import { Search, Filter, View, Star } from '@element-plus/icons-vue'

const store = useTravelStore()
const { travels } = storeToRefs(store)

const searchQuery = ref('')
const sortBy = ref('date')
const selectedCategory = ref('全部')

const categories = ['全部', '文化探索', '人文风光', '海岛度假']

const filteredTravels = computed(() => {
  let result = travels.value

  // 分类过滤
  if (selectedCategory.value !== '全部') {
    result = result.filter(travel => 
      travel.category === selectedCategory.value
    )
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(travel => 
      travel.title.toLowerCase().includes(query) ||
      travel.summary.toLowerCase().includes(query) ||
      travel.location.toLowerCase().includes(query)
    )
  }

  // 排序
  result = [...result].sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy.value === 'views') {
      return b.views - a.views
    } else if (sortBy.value === 'likes') {
      return b.likes - a.likes
    }
    return 0
  })

  return result
})

onMounted(async () => {
  await store.fetchTravels()
})
</script>

<template>
  <div class="travels">
    <div class="page-header">
      <h1>探索游记</h1>
      <p>发现更多有趣的旅行故事</p>
    </div>

    <div class="filters-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索目的地、标题或内容..."
          class="search-input"
          :prefix-icon="Search"
        />
      </div>

      <div class="filter-options">
        <el-radio-group v-model="selectedCategory" class="category-filter">
          <el-radio-button 
            v-for="category in categories" 
            :key="category" 
            :label="category"
          />
        </el-radio-group>

        <el-select v-model="sortBy" class="sort-select">
          <el-option label="最新发布" value="date">
            <el-icon><Calendar /></el-icon> 最新发布
          </el-option>
          <el-option label="最多浏览" value="views">
            <el-icon><View /></el-icon> 最多浏览
          </el-option>
          <el-option label="最多点赞" value="likes">
            <el-icon><Star /></el-icon> 最多点赞
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="travel-list">
      <el-row :gutter="20">
        <el-col 
          v-for="travel in filteredTravels" 
          :key="travel.id"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <TravelCard :travel="travel" />
        </el-col>
      </el-row>

      <div v-if="filteredTravels.length === 0" class="no-results">
        <el-empty description="暂无相关游记" />
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        :total="50"
        :page-size="9"
        layout="prev, pager, next"
        background
      />
    </div>
  </div>
</template>

<style scoped>
.travels {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.2em;
}

.filters-section {
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
}

.filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.category-filter {
  flex-grow: 1;
}

.sort-select {
  width: 150px;
}

.travel-list {
  margin-bottom: 40px;
  min-height: 400px;
}

.no-results {
  padding: 40px 0;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }

  .filter-options {
    flex-direction: column;
    align-items: stretch;
  }

  .category-filter {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px;
  }

  .sort-select {
    width: 100%;
  }
}

/* 自定义滚动条样式 */
.category-filter::-webkit-scrollbar {
  height: 4px;
}

.category-filter::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.category-filter::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.category-filter::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 添加一些动画效果 */
.travel-list .el-col {
  transition: transform 0.3s ease;
}

.travel-list .el-col:hover {
  transform: translateY(-5px);
}
</style> 
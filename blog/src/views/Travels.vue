<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../store/travel'
import TravelCard from '../components/TravelCard.vue'
import { Search, Filter, View, Star, User, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const store = useTravelStore()
const { travels } = storeToRefs(store)
const router = useRouter()

const searchQuery = ref('')
const sortBy = ref('date')
const selectedCategory = ref('全部')
const showSearchResults = ref(false)

const categories = ['全部', '前端开发', '后端开发', 'DevOps']

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

// 添加精选文章数据
const featuredArticles = computed(() => 
  travels.value
    .filter(article => article.featured)
    .slice(0, 5)
)

// 搜索相关状态
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return travels.value
    .filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
    .slice(0, 5) // 最多显示5条结果
})

// 处理搜索框聚焦
const handleSearchFocus = () => {
  showSearchResults.value = true
}

// 处理搜索框失焦
const handleSearchBlur = () => {
  // 延迟关闭，以便能够点击搜索结果
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// 处理文章选择
const handleArticleSelect = (article) => {
  router.push(`/travel/${article.id}`)
  searchQuery.value = ''
  showSearchResults.value = false
}

onMounted(async () => {
  await store.fetchTravels()
})
</script>

<template>
  <div class="travels">
    <div class="page-header">
      <h1>技术专栏</h1>
      <p>探索更多技术文章</p>
    </div>

    <!-- 添加轮播图部分 -->
    <div class="featured-carousel">
      <el-carousel :interval="4000" height="400px">
        <el-carousel-item v-for="item in featuredArticles" :key="item.id">
          <div class="carousel-content" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="carousel-info">
              <div class="category-tag">{{ item.category }}</div>
              <h2>{{ item.title }}</h2>
              <p>{{ item.summary }}</p>
              <div class="article-meta">
                <span class="author">
                  <el-icon><User /></el-icon>
                  {{ item.author }}
                </span>
                <span class="date">
                  <el-icon><Calendar /></el-icon>
                  {{ item.date }}
                </span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ item.views }}
                </span>
              </div>
              <el-button type="primary" plain>阅读全文</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="filters-section">
      <div class="search-bar">
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索文章标题或内容..."
            class="search-input"
            :prefix-icon="Search"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
          />
          <!-- 搜索结果下拉框 -->
          <div 
            v-show="showSearchResults && searchResults.length > 0" 
            class="search-results"
          >
            <div
              v-for="article in searchResults"
              :key="article.id"
              class="search-result-item"
              @mousedown="handleArticleSelect(article)"
            >
              <div class="result-title">{{ article.title }}</div>
              <div class="result-meta">
                <span class="category">{{ article.category }}</span>
                <span class="author">{{ article.author }}</span>
              </div>
            </div>
          </div>
        </div>
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

/* 添加轮播图相关样式 */
.featured-carousel {
  margin: -20px -20px 40px -20px;
}

.carousel-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 60px;
}

.carousel-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
}

.carousel-info {
  position: relative;
  color: white;
  max-width: 600px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: var(--el-color-primary);
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.carousel-info h2 {
  font-size: 2.5em;
  margin-bottom: 16px;
  font-weight: 600;
}

.carousel-info p {
  font-size: 1.1em;
  margin-bottom: 24px;
  opacity: 0.9;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  font-size: 0.9em;
  opacity: 0.8;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 自定义轮播图指示器样式 */
:deep(.el-carousel__indicators) {
  transform: translateY(24px);
}

:deep(.el-carousel__indicator) {
  padding: 12px 4px;
}

:deep(.el-carousel__button) {
  width: 30px;
  height: 3px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .carousel-content {
    padding: 0 20px;
  }

  .carousel-info h2 {
    font-size: 1.8em;
  }

  .article-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}

.search-container {
  position: relative;
  width: 100%;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.search-result-item:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.result-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.result-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 12px;
}

.category {
  color: var(--el-color-primary);
}

/* 自定义搜索结果滚动条 */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.search-results::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 
<template>
  <div class="home">
    <!-- 新的 Hero 区域设计 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>
          <span class="highlight">Code</span> & 
          <span class="highlight">Share</span>
        </h1>
        <p class="subtitle">探索、学习、分享，打造高质量的技术社区</p>
        <div class="search-box">
          <div class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="搜索技术文章..."
              :prefix-icon="Search"
              size="large"
              class="search-input"
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
          <el-button type="primary" size="large">
            开始写作
          </el-button>
        </div>
      </div>
    </div>

    <!-- 技术分类卡片 -->
    <div class="tech-categories">
      <h2 class="section-title">探索技术领域</h2>
      <el-row :gutter="30">
        <el-col :span="8" v-for="category in ['前端开发', '后端开发', 'DevOps']" :key="category">
          <div class="tech-card">
            <el-icon size="32px" class="tech-icon">
              <component :is="getCategoryIcon(category)" />
            </el-icon>
            <h3>{{ category }}</h3>
            <p>{{ getCategoryDesc(category) }}</p>
            <el-button text>探索更多 →</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 精选文章区域 -->
    <div class="featured-articles">
      <h2 class="section-title">精选文章</h2>
      <el-row :gutter="30">
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

    <!-- 数据统计区域 -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">1000+</div>
        <div class="stat-label">技术文章</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">技术专题</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">10000+</div>
        <div class="stat-label">开发者</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f9fafb;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #373737 100%);
  padding: 120px 20px;
  color: white;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 4em;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.highlight {
  color: var(--el-color-primary);
}

.subtitle {
  font-size: 1.5em;
  opacity: 0.9;
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex-grow: 1;
}

.tech-categories {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 50px;
  color: #1a1a1a;
  font-weight: 700;
}

.tech-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
}

.tech-card:hover {
  transform: translateY(-5px);
}

.tech-icon {
  color: var(--el-color-primary);
  margin-bottom: 20px;
}

.tech-card h3 {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #1a1a1a;
}

.tech-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.featured-articles {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 60px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 3em;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.2em;
  color: #666;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.2em;
  }

  .search-box {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.search-container {
  position: relative;
  flex-grow: 1;
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

/* 调整搜索框在深色背景下的样式 */
.search-box :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.3);
}

.search-box :deep(.el-input__inner) {
  color: white;
}

.search-box :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

.search-box :deep(.el-input__prefix-inner i) {
  color: rgba(255, 255, 255, 0.7);
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../store/travel'
import TravelCard from '../components/TravelCard.vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useTravelStore()
const { travels } = storeToRefs(store)
const { featuredTravels } = storeToRefs(store)

// 搜索相关状态
const searchQuery = ref('')
const showSearchResults = ref(false)

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return travels.value
    .filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
    .slice(0, 5)
})

// 处理搜索框聚焦
const handleSearchFocus = () => {
  showSearchResults.value = true
}

// 处理搜索框失焦
const handleSearchBlur = () => {
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

function getCategoryIcon(category) {
  switch (category) {
    case '前端开发':
      return 'Monitor'
    case '后端开发':
      return 'Server'
    case 'DevOps':
      return 'SetUp'
    default:
      return 'Document'
  }
}

function getCategoryDesc(category) {
  switch (category) {
    case '前端开发':
      return '探索现代前端技术和最佳实践'
    case '后端开发':
      return '深入后端架构与性能优化'
    case 'DevOps':
      return '掌握自动化部署与运维技巧'
    default:
      return '分享技术经验'
  }
}
</script>
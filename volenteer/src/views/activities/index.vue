<template>
  <div class="activities-container">
    <user-info />
    <div class="activities-content">
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="活动名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入活动名称"
              clearable
              @clear="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="时间区间">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="[
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 1, 1, 23, 59, 59),
              ]"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <h2>活动列表</h2>
      <div class="activities-grid">
        <el-card 
          v-for="activity in currentActivities" 
          :key="activity.id" 
          class="activity-card"
          @click="handleActivityClick(activity)"
        >
          <template #header>
            <div class="card-header">
              <span class="activity-name">{{ activity.name }}</span>
              <el-tag :type="getStatusType(activity.status)">
                {{ getStatusText(activity.status) }}
              </el-tag>
            </div>
          </template>
          <div class="activity-info">
            <p><i class="el-icon-location"></i> {{ activity.location }}</p>
            <p><i class="el-icon-time"></i> {{ formatDateTime(activity.start_time) }}</p>
            <p class="description">{{ activity.description }}</p>
          </div>
        </el-card>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="activities.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserInfo from '../../components/UserInfo.vue'
import request from '../../utils/request'

const router = useRouter()
const activities = ref([])
const currentPage = ref(1)
const pageSize = ref(8)

// 搜索表单
const searchForm = ref({
  name: '',
  timeRange: null
})

// 获取活动列表
const getActivities = async () => {
  try {
    const params = {
      name: searchForm.value.name
    }
    
    if (searchForm.value.timeRange) {
      params.startTime = searchForm.value.timeRange[0]
      params.endTime = searchForm.value.timeRange[1]
    }
    
    const res = await request.get('/activities', { params })
    activities.value = res
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getActivities()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    timeRange: null
  }
  handleSearch()
}

// 获取当前页的活动
const currentActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return activities.value.slice(start, start + pageSize.value)
})

// 格式化日期时间
const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return types[status]
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  }
  return texts[status]
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
}

// 处理活动点击
const handleActivityClick = (activity) => {
  router.push(`/activities/${activity.id}`)
}

onMounted(() => {
  getActivities()
})
</script>

<style scoped>
.activities-container {
  padding: 20px 40px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.activities-content {
  margin-top: 20px;
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.activity-card {
  cursor: pointer;
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-name {
  font-weight: bold;
  font-size: 16px;
}

.activity-info p {
  margin: 10px 0;
  color: #666;
}

.activity-info .description {
  margin-top: 15px;
  color: #999;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 
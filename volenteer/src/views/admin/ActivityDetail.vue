<template>
  <div class="activity-detail">
    <div class="header">
      <h2>活动详情</h2>
      <el-button @click="router.back()">返回</el-button>
    </div>

    <el-descriptions :column="2" border>
      <el-descriptions-item label="活动名称">{{ activity.name }}</el-descriptions-item>
      <el-descriptions-item label="活动地点">{{ activity.location }}</el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ formatDateTime(activity.start_time) }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ formatDateTime(activity.end_time) }}</el-descriptions-item>
      <el-descriptions-item label="活动状态">
        <el-tag :type="getStatusType(activity.status)">
          {{ getStatusText(activity.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatDateTime(activity.created_at) }}</el-descriptions-item>
      <el-descriptions-item label="活动描述" :span="2">{{ activity.description }}</el-descriptions-item>
    </el-descriptions>

    <div class="section">
      <h3>报名人员</h3>
      <el-table :data="registrations" border style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="联系方式" />
        <el-table-column label="签到状态">
          <template #default="{ row }">
            <el-tag :type="row.sign_status ? 'success' : 'warning'">
              {{ row.sign_status ? '已签到' : '未签到' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签到时间">
          <template #default="{ row }">
            {{ row.sign_time ? formatDateTime(row.sign_time) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              v-if="!row.sign_status && activity.status === 1"
              type="primary" 
              size="small"
              @click="handleSign(row)"
            >签到</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

const route = useRoute()
const router = useRouter()
const activity = ref({})
const registrations = ref([])

// 获取活动详情
const getActivityDetail = async () => {
  try {
    const res = await request.get(`/activities/${route.params.id}`)
    activity.value = res
  } catch (error) {
    console.error('获取活动详情失败:', error)
  }
}

// 获取报名人员列表
const getRegistrations = async () => {
  try {
    const res = await request.get(`/activities/${route.params.id}/registrations`)
    registrations.value = res
  } catch (error) {
    console.error('获取报名人员失败:', error)
  }
}

// 帮助签到
const handleSign = async (row) => {
  try {
    await request.put(`/activities/${route.params.id}/sign/${row.user_id}`)
    ElMessage.success('签到成功')
    getRegistrations()
  } catch (error) {
    console.error('签到失败:', error)
  }
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
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

onMounted(() => {
  getActivityDetail()
  getRegistrations()
})
</script>

<style scoped>
.activity-detail {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section {
  margin-top: 30px;
}

h2, h3 {
  margin: 0;
}

h3 {
  margin-bottom: 20px;
}
</style> 
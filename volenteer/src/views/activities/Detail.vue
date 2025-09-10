<template>
  <div v-if="isInAdminLayout" class="activity-detail-admin">
    {{ activity.name }}
  </div>
  <div v-else class="activity-detail">
    <el-card>
      <template #header>
        <div class="header">
          <h2>{{ activity.name }}</h2>
          <div class="actions">
            <el-tag :type="getStatusType(activity.status)">
              {{ getStatusText(activity.status) }}
            </el-tag>
            <template v-if="isAdmin">
              <el-button 
                v-if="activity.status === 0"
                type="success" 
                @click="handleStartActivity"
              >开始活动</el-button>
              <el-button 
                v-if="activity.status === 1"
                type="warning" 
                @click="handleEndActivity"
              >结束活动</el-button>
            </template>
            <el-button @click="router.back()">返回</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动地点">{{ activity.location }}</el-descriptions-item>
        <el-descriptions-item label="活动时间">
          {{ formatDateTime(activity.start_time) }} 至 {{ formatDateTime(activity.end_time) }}
        </el-descriptions-item>
        <el-descriptions-item label="活动描述" :span="2">{{ activity.description }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="!isAdmin" class="action-section">
        <el-button 
          v-if="activity.status === 0" 
          type="primary" 
          @click="handleRegister" 
          :disabled="isRegistered"
        >
          {{ isRegistered ? '已报名' : '报名参加' }}
        </el-button>
        
        <el-button 
          v-if="activity.status === 1 && isRegistered && !hasSignedIn" 
          type="success" 
          @click="handleSignIn"
        >签到</el-button>
        
        <el-tag v-if="hasSignedIn" type="success">已签到</el-tag>
        
        <el-tag 
          v-if="activity.status === 2 && isRegistered && !hasSignedIn" 
          type="danger"
        >未签到</el-tag>
      </div>

      <div class="volunteers-section">
        <h3>报名志愿者</h3>
        <el-table :data="volunteers" style="width: 100%" border>
          <el-table-column prop="name" label="姓名" />
          <el-table-column label="联系方式">
            <template #default="{ row }">
              {{ maskPhoneNumber(row.phone) }}
            </template>
          </el-table-column>
          <el-table-column label="签到状态">
            <template #default="{ row }">
              <el-tag :type="row.sign_status ? 'success' : 'warning'">
                {{ row.sign_status ? '已签到' : '未签到' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="签到时间" width="160">
            <template #default="{ row }">
              {{ row.sign_time ? formatDateTime(row.sign_time) : '-' }}
            </template>
          </el-table-column>
          <el-table-column v-if="isAdmin" label="操作" width="120">
            <template #default="{ row }">
              <el-button 
                v-if="!row.sign_status && (activity.status === 1 || activity.status === 2)"
                type="primary" 
                size="small"
                @click="handleAdminSignIn(row)"
              >{{ activity.status === 2 ? '补签' : '签到' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const activity = ref({})
const volunteers = ref([])
const isRegistered = ref(false)
const hasSignedIn = ref(false)

const isAdmin = computed(() => userStore.isAdmin)
const isInAdminLayout = computed(() => route.path.includes('/admin/'))

const getActivityDetail = async () => {
  try {
    const res = await request.get(`/activities/${route.params.id}`)
    activity.value = res
    await Promise.all([
      getVolunteers(),
      checkRegistration()
    ])
  } catch (error) {
    console.error('获取活动详情失败:', error)
  }
}

const getVolunteers = async () => {
  try {
    const res = await request.get(`/activities/${route.params.id}/volunteers`)
    volunteers.value = res
    if (!isAdmin.value) {
      const currentUser = res.find(v => v.id === userStore.userInfo.id)
      if (currentUser) {
        hasSignedIn.value = currentUser.sign_status === 1
      }
    }
  } catch (error) {
    console.error('获取志愿者列表失败:', error)
  }
}

const checkRegistration = async () => {
  if (isAdmin.value) return
  try {
    const res = await request.get(`/activities/${route.params.id}/check-registration`)
    isRegistered.value = res.registered
  } catch (error) {
    console.error('检查报名状态失败:', error)
  }
}

const handleRegister = async () => {
  try {
    await request.post(`/activities/${route.params.id}/register`)
    ElMessage.success('报名成功')
    isRegistered.value = true
    getVolunteers()
  } catch (error) {
    console.error('报名失败:', error)
  }
}

const handleSignIn = async () => {
  try {
    await request.post(`/activities/${route.params.id}/sign-in`)
    ElMessage.success('签到成功')
    hasSignedIn.value = true
    getVolunteers()
  } catch (error) {
    console.error('签到失败:', error)
  }
}

const handleAdminSignIn = async (volunteer) => {
  try {
    await ElMessageBox.confirm(
      `确定要为志愿者 ${volunteer.name} ${activity.status === 2 ? '补签' : '签到'}吗？`, 
      '提示'
    )
    await request.put(`/activities/${route.params.id}/sign/${volunteer.id}`)
    ElMessage.success('操作成功')
    getVolunteers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
    }
  }
}

const handleStartActivity = async () => {
  try {
    await ElMessageBox.confirm('确定要开始活动吗？', '提示')
    await request.put(`/activities/${route.params.id}/start`)
    ElMessage.success('活动已开始')
    getActivityDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('开始活动失败:', error)
    }
  }
}

const handleEndActivity = async () => {
  try {
    await ElMessageBox.confirm('确定要结束活动吗？', '提示')
    await request.put(`/activities/${route.params.id}/end`)
    ElMessage.success('活动已结束')
    getActivityDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('结束活动失败:', error)
    }
  }
}

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

const getStatusType = (status) => {
  const types = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return types[status]
}

const getStatusText = (status) => {
  const texts = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  }
  return texts[status]
}

// 手机号码脱敏处理
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

onMounted(() => {
  getActivityDetail()
})
</script>

<style scoped>
.activity-detail-admin {
  padding: 20px;
}

.activity-detail {
  padding: 40px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.volunteers-section {
  margin-top: 30px;
}

h2, h3 {
  margin: 0;
}

h3 {
  margin-bottom: 20px;
}

.action-section {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}
</style> 
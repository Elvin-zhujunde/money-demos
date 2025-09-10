<template>
  <div class="activity-management">
    <div class="header">
      <h2>活动管理</h2>
      <el-button type="primary" @click="handleAdd">新增活动</el-button>
    </div>

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

    <div class="operation-bar">
      <el-button type="primary" @click="router.push('/admin/activities/create')">
        创建活动
      </el-button>
    </div>

    <el-table :data="activities" style="width: 100%" border>
      <el-table-column prop="name" label="活动名称" width="200" />
      <el-table-column prop="location" label="活动地点" width="200" />
      <el-table-column label="活动时间" width="300">
        <template #default="{ row }">
          {{ formatDateTime(row.start_time) }} 至 {{ formatDateTime(row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column label="活动状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button 
            v-if="row.status === 0" 
            type="success" 
            size="small" 
            @click="handleStart(row)"
          >开始活动</el-button>
          <el-button 
            v-if="row.status === 1" 
            type="warning" 
            size="small" 
            @click="handleEnd(row)"
          >结束活动</el-button>
          <el-button 
            type="primary" 
            size="small" 
            @click="handleDetail(row)"
          >查看详情</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      title="编辑活动"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'
import { reactive } from 'vue';

const router = useRouter()
const activities = ref([])

// 搜索表单
const searchForm = ref({
  name: '',
  timeRange: null
})

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  name: '',
  location: '',
  timeRange: null,
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' }
  ]
}

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

// 开始活动
const handleStart = async (row) => {
  try {
    await request.put(`/activities/${row.id}/start`)
    ElMessage.success('活动已开始')
    getActivities()
  } catch (error) {
    console.error('开始活动失败:', error)
  }
}

// 结束活动
const handleEnd = async (row) => {
  try {
    await request.put(`/activities/${row.id}/end`)
    ElMessage.success('活动已结束')
    getActivities()
  } catch (error) {
    console.error('结束活动失败:', error)
  }
}

// 删除活动
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
      type: 'warning'
    })
    await request.delete(`/activities/${row.id}`)
    ElMessage.success('删除成功')
    getActivities()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除活动失败:', error)
    }
  }
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/activities/${row.id}`)
}

// 新增活动
const handleAdd = () => {
  router.push('/admin/activities/create')
}

// 搜索
const handleSearch = () => {
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

// 处理编辑按钮点击
const handleEdit = (row) => {
  form.id = row.id
  form.name = row.name
  form.location = row.location
  form.description = row.description
  form.timeRange = [row.start_time, row.end_time]
  dialogVisible.value = true
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const updateData = {
          name: form.name,
          location: form.location,
          description: form.description,
          start_time: form.timeRange[0],
          end_time: form.timeRange[1]
        }
        
        await request.put(`/activities/${form.id}`, updateData)
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getActivities() // 刷新列表
      } catch (error) {
        console.error('更新活动失败:', error)
      }
    }
  })
}

onMounted(() => {
  getActivities()
})
</script>

<style scoped>
.activity-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.operation-bar {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 
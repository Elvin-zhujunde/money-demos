<template>
  <div class="activity-create">
    <div class="header">
      <h2>新增活动</h2>
      <el-button @click="router.back()">返回</el-button>
    </div>

    <el-form 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="activity-form"
    >
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入活动名称" />
      </el-form-item>

      <el-form-item label="活动地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入活动地点" />
      </el-form-item>

      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[
            new Date(2000, 1, 1, 8, 0, 0),
            new Date(2000, 1, 1, 17, 0, 0),
          ]"
        />
      </el-form-item>

      <el-form-item label="活动描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入活动描述"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">创建活动</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)

const form = reactive({
  name: '',
  location: '',
  time: null,
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
  time: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' }
  ]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const [start_time, end_time] = form.time
        const data = {
          name: form.name,
          location: form.location,
          start_time: start_time.toISOString().slice(0, 19).replace('T', ' '),
          end_time: end_time.toISOString().slice(0, 19).replace('T', ' '),
          description: form.description,
          creator_id: userStore.userInfo.id
        }
        await request.post('/activities', data)
        ElMessage.success('创建成功')
        router.push('/admin/activities')
      } catch (error) {
        console.error('创建活动失败:', error)
      }
    }
  })
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style scoped>
.activity-create {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-form {
  max-width: 800px;
}

h2 {
  margin: 0;
}
</style> 
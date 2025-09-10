<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">编辑</el-button>
          <div v-else>
            <el-button type="success" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="120" />
        </el-form-item>
        
        <el-form-item label="身份证号">
          <el-input v-model="form.id_card" disabled />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="form.phone" disabled />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="form.email" disabled />
        </el-form-item>
        
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
        
        <el-form-item label="角色">
          <el-tag :type="getRoleType(userStore.userInfo.role)">
            {{ getRoleText(userStore.userInfo.role) }}
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import request from '../utils/request'

const userStore = useUserStore()
const formRef = ref(null)
const isEditing = ref(false)
const originalForm = ref(null)

const form = reactive({
  name: '',
  age: 0,
  id_card: '',
  phone: '',
  email: '',
  address: ''
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ]
}

const getRoleType = (role) => {
  const types = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return types[role]
}

const getRoleText = (role) => {
  const texts = {
    0: '志愿者',
    1: '管理员',
    2: '超级管理员'
  }
  return texts[role]
}

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await request.get('/users/current')
    Object.assign(form, res)
    originalForm.value = { ...res }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleEdit = () => {
  isEditing.value = true
}

const handleCancel = () => {
  isEditing.value = false
  Object.assign(form, originalForm.value)
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 只发送允许修改的字段
        const updateData = {
          name: form.name,
          age: form.age,
          address: form.address
        }
        const res = await request.put('/users/current', updateData)
        ElMessage.success('保存成功')
        isEditing.value = false
        originalForm.value = { ...form }
        // 更新 store 中的用户信息
        userStore.setUserInfo(res.user)
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 40px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
}

.el-form {
  margin-top: 20px;
}
</style> 
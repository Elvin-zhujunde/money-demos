<template>
  <div class="users-manage">
    <el-card>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/邮箱/手机号"
          clearable
          @input="handleSearch"
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-button type="primary" @click="handleAdd">
          新增用户
        </el-button>
      </div>

      <!-- 用户列表 -->
      <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : ''">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.role === 'admin'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" class="w-100">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="收货地址" prop="address">
          <el-input 
            v-model="form.address"
            type="textarea"
            rows="2"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

const loading = ref(false)
const submitting = ref(false)
const users = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()

// 表单数据
const form = ref({
  username: '',
  password: '',
  email: '',
  phone: '',
  role: 'user',
  address: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 过滤用户列表
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword) ||
    user.phone.includes(keyword)
  )
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/users')
    users.value = data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'user',
    address: ''
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该用户吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await axios.delete(`/api/users/${row.id}`)
    ElMessage.success('删除成功')
    await fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          // 新增用户
          form.value.createTime = new Date().toISOString()
          await axios.post('/api/users', form.value)
          ElMessage.success('添加成功')
        } else {
          // 编辑用户
          const { id } = form.value
          await axios.patch(`/api/users/${id}`, form.value)
          ElMessage.success('更新成功')
        }
        
        dialogVisible.value = false
        await fetchUsers()
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 搜索处理
const handleSearch = () => {
  // 已通过计算属性自动处理
}

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-manage {
  min-height: calc(100vh - 120px);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.w-100 {
  width: 100%;
}
</style>

<script>
export default {
  name: 'UsersManageView'
}
</script> 
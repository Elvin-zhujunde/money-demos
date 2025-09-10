<template>
  <div class="user-management">
    <h2>用户管理</h2>
    
    <el-table :data="users" style="width: 100%" border>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column prop="id_card" label="身份证号" width="180" />
      <el-table-column label="联系方式">
        <template #default="{ row }">
          {{ maskPhoneNumber(row.phone) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">
            {{ getRoleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button 
            v-if="row.role === 0"
            type="danger" 
            size="small" 
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑用户信息"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="120" />
        </el-form-item>
        
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="form.id_card" />
        </el-form-item>
        
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'

const users = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  name: '',
  age: 0,
  id_card: '',
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
  id_card: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ]
}

// 获取用户列表
const getUsers = async () => {
  try {
    const res = await request.get('/users')
    users.value = res
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 手机号码脱敏
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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

// 处理编辑
const handleEdit = (row) => {
  form.id = row.id
  form.name = row.name
  form.age = row.age
  form.id_card = row.id_card
  form.address = row.address
  dialogVisible.value = true
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await request.put(`/users/${form.id}`, form)
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getUsers()
      } catch (error) {
        console.error('更新用户失败:', error)
      }
    }
  })
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除志愿者 ${row.name} 吗？此操作将同时删除该用户的所有活动报名记录。`, 
      '警告', 
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    await request.delete(`/users/${row.id}`)
    ElMessage.success('删除成功')
    getUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
    }
  }
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 
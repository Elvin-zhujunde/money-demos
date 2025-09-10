<template>
  <div class="users-container">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 用户列表 -->
    <el-table
      v-loading="loading"
      :data="users"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="username"
        label="用户名"
        width="120"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
      <el-table-column
        prop="phone"
        label="手机号"
        width="120"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
      <el-table-column
        prop="role"
        label="角色"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="row.role === 1 ? 'success' : ''">
            {{ row.role === 1 ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="editingUser.id ? '编辑用户' : '新增用户'"
      :visible.sync="showEditDialog"
      width="500px"
    >
      <el-form
        ref="userForm"
        :model="editingUser"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editingUser.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editingUser.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editingUser.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editingUser.role">
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      loading: false,
      users: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showEditDialog: false,
      editingUser: {
        id: '',
        name: '',
        phone: '',
        email: '',
        role: 0
      },
      submitting: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true
        const res = await this.$axios.get('/api/admin/users', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        if (res.code === 200) {
          this.users = res.data.list
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        if (error.response && error.response.status === 401) {
          this.$message.error('请先登录')
          this.$router.push('/login')
        } else {
          this.$message.error('获取用户列表失败')
        }
      } finally {
        this.loading = false
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchUsers()
    },
    handleEdit(user) {
      this.editingUser = { ...user }
      this.showEditDialog = true
    },
    async handleDelete(user) {
      try {
        await this.$confirm('确定要删除该用户吗？', '提示', {
          type: 'warning'
        })
        const res = await this.$axios.delete(`/api/admin/users/${user.id}`)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.fetchUsers()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error)
          this.$message.error('删除用户失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.userForm.validate()
        this.submitting = true

        const res = await this.$axios.put(
          `/api/admin/users/${this.editingUser.id}`,
          this.editingUser
        )

        if (res.code === 200) {
          this.$message.success('更新成功')
          this.showEditDialog = false
          this.fetchUsers()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新用户失败:', error)
          this.$message.error('更新用户失败')
        }
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 
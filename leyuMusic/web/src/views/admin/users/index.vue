<template>
  <div class="admin-users">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="left">
        <el-input
          v-model="keyword"
          placeholder="搜索用户名/昵称"
          prefix-icon="el-icon-search"
          style="width: 300px"
          @keyup.enter.native="handleSearch"
          clearable
        />
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" @click="showCreateModal">
          添加用户
        </el-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table
      :data="users"
      v-loading="loading"
      style="width: 100%"
      border
    >
      <el-table-column
        label="头像"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar || 'https://picsum.photos/100/100'"
            class="user-avatar"
            alt="头像"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="username"
        label="用户名"
      />

      <el-table-column
        prop="nickname"
        label="昵称"
      />

      <el-table-column
        prop="gender"
        label="性别"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '保密' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="role"
        label="角色"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : ''">
            {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定要删除这个用户吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <el-button
              slot="reference"
              type="text"
              icon="el-icon-delete"
              class="danger-button"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 创建/编辑弹窗 -->
    <el-dialog
      :title="editingId ? '编辑用户' : '添加用户'"
      :visible.sync="modalVisible"
      width="500px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="!editingId">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="`${baseURL}/api/admin/users/upload/avatar`"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeUploadImage"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
          >
            <img
              v-if="form.avatar"
              :src="form.avatar"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="签名" prop="signature">
          <el-input
            type="textarea"
            v-model="form.signature"
            placeholder="请输入个性签名"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      baseURL: 'http://localhost:3000',
      loading: false,
      keyword: '',
      users: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      modalVisible: false,
      submitting: false,
      editingId: null,
      form: {
        username: '',
        password: '',
        nickname: '',
        gender: 0,
        role: 'user',
        avatar: '',
        signature: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  },
  methods: {
    // 获取用户列表
    async fetchUsers() {
      this.loading = true
      try {
        const res = await this.$http.get('/api/admin/users', {
          params: {
            keyword: this.keyword,
            page: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        })
        if (res.code === 200) {
          this.users = res.data.list
          this.pagination.total = res.data.total
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current = 1
      this.fetchUsers()
    },

    // 分页改变
    handleCurrentChange(page) {
      this.pagination.current = page
      this.fetchUsers()
    },

    // 显示创建弹窗
    showCreateModal() {
      this.editingId = null
      this.form = {
        username: '',
        password: '',
        nickname: '',
        gender: 0,
        role: 'user',
        avatar: '',
        signature: ''
      }
      this.modalVisible = true
    },

    // 显示编辑弹窗
    handleEdit(record) {
      this.editingId = record.id
      this.form = {
        username: record.username,
        nickname: record.nickname,
        gender: record.gender,
        role: record.role,
        avatar: record.avatar,
        signature: record.signature
      }
      this.modalVisible = true
    },

    // 删除用户
    async handleDelete(id) {
      try {
        const res = await this.$http.delete(`/api/admin/users/${id}`)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.fetchUsers()
        }
      } catch (error) {
        console.error('删除失败:', error)
        this.$message.error('删除失败')
      }
    },

    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
        this.submitting = true

        const formData = { ...this.form }
        if (this.editingId) {
          // 编辑时不提交密码
          delete formData.password
        }

        if (this.editingId) {
          await this.$http.put(`/api/admin/users/${this.editingId}`, formData)
          this.$message.success('更新成功')
        } else {
          await this.$http.post('/api/admin/users', formData)
          this.$message.success('创建成功')
        }

        this.modalVisible = false
        this.fetchUsers()
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error(error.message || '操作失败')
      } finally {
        this.submitting = false
      }
    },

    // 取消
    handleCancel() {
      this.modalVisible = false
      this.$refs.form.resetFields()
    },

    // 上传前检查
    beforeUploadImage(file) {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
      }
      return isImage
    },

    // 头像上传成功
    handleAvatarSuccess(res) {
      this.form.avatar = res.data.url
      this.$message.success('上传成功')
    },

    // 头像上传失败
    handleAvatarError() {
      this.$message.error('上传失败')
    }
  },
  created() {
    this.fetchUsers()
  }
}
</script>

<style lang="less" scoped>
.admin-users {
  .page-header {
    margin-bottom: 24px;
  }

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .danger-button {
    color: #F56C6C;
    margin-left: 10px;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
}
</style> 
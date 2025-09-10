<template>
  <el-dialog
    title="编辑个人信息"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="`${baseURL}/api/upload`"
          :headers="uploadHeaders"
          name="file"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserInfoDialog',
  
  props: {
    value: Boolean,
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        avatar: ''
      },
      rules: {
        name: [{ required: true, message: '请输入昵称' }],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      baseURL: process.env.VUE_APP_API_URL || 'http://localhost:9090'
    }
  },

  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    uploadHeaders() {
      return {
        'user-info': encodeURIComponent(localStorage.getItem('userInfo'))
      }
    }
  },

  watch: {
    userInfo: {
      handler(val) {
        if (val) {
          this.form = { ...val }
        }
      },
      immediate: true
    }
  },

  methods: {
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.form.avatar = this.baseURL + res.data.url
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.message || '上传失败')
      }
    },

    handleUploadError(err) {
      console.error('上传失败:', err)
      this.$message.error('上传失败，请重试')
    },

    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }
      return true
    },

    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        const res = await this.$axios.put('/api/user/profile', this.form)
        
        if (res.code === 200) {
          this.$message.success('更新成功')
          try {
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            window.location.reload()
          } catch (e) {
            console.error('保存用户信息失败:', e)
          }
          this.$emit('success')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        if (error.name !== 'ValidationError') {
          console.error('更新失败:', error)
          this.$message.error('更新失败')
        }
      }
    },

    handleClose() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      this.form = { ...this.userInfo }
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: #333;
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
</style> 
<template>
  <a-modal
    :visible="visible"
    :title="isLogin ? '登录' : '注册'"
    @cancel="handleCancel"
    :footer="null"
    width="400px"
    :destroyOnClose="true"
  >
    <div class="login-modal">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        @submit.native.prevent="handleSubmit"
      >
        <a-form-model-item prop="username">
          <a-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>

        <a-form-model-item prop="password">
          <a-input-password
            v-model="form.password"
            placeholder="请输入密码"
            size="large"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-model-item>

        <template v-if="!isLogin">
          <a-form-model-item prop="confirmPassword">
            <a-input-password
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              size="large"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input-password>
          </a-form-model-item>

          <a-form-model-item prop="nickname">
            <a-input
              v-model="form.nickname"
              placeholder="请输入昵称"
              size="large"
            >
              <a-icon slot="prefix" type="smile" />
            </a-input>
          </a-form-model-item>
        </template>

        <div class="form-footer">
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            {{ isLogin ? '登录' : '注册' }}
          </a-button>
          <div class="switch-type">
            {{ isLogin ? '还没有账号？' : '已有账号？' }}
            <a @click="isLogin = !isLogin">
              {{ isLogin ? '立即注册' : '去登录' }}
            </a>
          </div>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'LoginModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    // 确认密码验证规则
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      isLogin: true,
      loading: false,
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
      this.resetForm()
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.form = {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: ''
      }
    },
    async handleSubmit() {
      try {
        this.loading = true
        // 使用 validate 方法进行表单验证
        await this.$refs.form.validate()
        
        if (this.isLogin) {
          // 登录请求
          const res = await this.$http.post('/api/auth/login', {
            username: this.form.username,
            password: this.form.password
          })
          
          if (res.code === 200) {
            // 保存用户信息和token
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
            localStorage.setItem('token', res.data.token)
            
            this.$message.success('登录成功')
            this.$emit('update:visible', false)
            
            // 根据角色跳转不同页面
            if (res.data.userInfo.role === 'admin') {
              // 如果当前不在管理后台,才跳转
              if (!this.$route.path.startsWith('/admin')) {
                this.$router.push('/admin')
              }
            } else {
              // 如果有回调地址且不是当前页面,才跳转
              const redirect = this.$route.query.redirect
              if (redirect && redirect !== this.$route.path) {
                this.$router.push(redirect)
              }
              window.location.reload()
            }
          }
        } else {
          // 注册请求
          const res = await this.$http.post('/api/auth/register', {
            username: this.form.username,
            password: this.form.password,
            nickname: this.form.nickname
          })
          
          if (res.code === 200) {
            this.$message.success('注册成功，请登录')
            this.isLogin = true
            this.resetForm()
          }
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error(error.message || '操作失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-modal {
  .ant-modal {
    .ant-modal-content {
      background: #fff;
      border-radius: 4px;
      
      .ant-modal-header {
        background: #000;
        border-radius: 4px 4px 0 0;
        
        .ant-modal-title {
          color: #fff;
        }
      }
      
      .ant-modal-body {
        padding: 24px;
      }
      
      .ant-modal-footer {
        border-top: 1px solid #f0f0f0;
        padding: 10px 16px;
      }
    }
  }

  .switch-form {
    text-align: center;
    margin-top: 16px;
    
    .switch-button {
      color: #000;
      
      &:hover {
        color: #666;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    
    &:focus, &:hover {
      border-color: #000;
    }
  }

  .ant-btn-primary {
    background: #000;
    border-color: #000;
    
    &:hover {
      background: #333;
      border-color: #333;
    }
  }
}
</style> 
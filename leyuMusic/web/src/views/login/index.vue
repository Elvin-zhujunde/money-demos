<template>
  <div class="login-container">
    <a-form
      :model="formData"
      @finish="handleSubmit"
    >
      <a-form-item
        name="username"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input
          v-model:value="formData.username"
          placeholder="请输入用户名"
          size="large"
          autocomplete="username"
        />
      </a-form-item>
      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="formData.password"
          placeholder="请输入密码"
          size="large"
          autocomplete="current-password"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" block size="large">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'Login',
  setup() {
    const formData = reactive({
      username: '',
      password: ''
    })

    return {
      formData
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    async handleSubmit() {
      try {
        await this.login(this.formData)
        this.$message.success('登录成功')
        this.$router.push('/')
      } catch (error) {
        this.$message.error(error.message || '登录失败')
      }
    }
  }
})
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .ant-form {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style> 
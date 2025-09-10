<template>
  <div class="login-container">
    <div class="login-content">
      <!-- 左侧图片 -->
      <div class="login-banner">
        <img src="@/assets/login-banner.png" alt="登录页banner" />
        <div class="banner-text">
          <h2>爱购商城</h2>
          <p>精选好物，品质生活</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-box">
        <div class="form-header">
          <div class="title">{{ isLogin ? "欢迎回来" : "加入我们" }}</div>
          <div class="subtitle">
            {{
              isLogin ? "立即登录，开启您的购物之旅" : "成为会员，享受更多优惠"
            }}
          </div>
        </div>

        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item v-if="isLogin" label="登录身份" prop="role">
            <el-select
              v-model="role"
              placeholder="请选择登录身份"
              style="width: 100%"
            >
              <el-option label="普通用户" :value="0"></el-option>
              <el-option label="管理员" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-user"
              placeholder="请输入用户名"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>

          <template v-if="!isLogin">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="请再次输入密码"
                show-password
              ></el-input>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="昵称" prop="name">
                  <el-input
                    v-model="form.name"
                    prefix-icon="el-icon-user"
                    placeholder="请输入昵称"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="form.phone"
                    prefix-icon="el-icon-mobile-phone"
                    placeholder="请输入手机号"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                prefix-icon="el-icon-message"
                placeholder="请输入邮箱"
              >
              </el-input>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ isLogin ? "登录" : "注册" }}
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <el-button type="text" @click="toggleMode">
              {{ isLogin ? "没有账号？去注册" : "已有账号？去登录" }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    // 密码确认验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    // 用户名验证
    const validateUsername = (rule, value, callback) => {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error("用户名不能包含中文"));
      } else {
        callback();
      }
    };

    // 密码验证
    const validatePassword = (rule, value, callback) => {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error("密码不能包含中文"));
      } else {
        callback();
      }
    };

    return {
      isLogin: true,
      loading: false,
      role: 0,

      form: {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        email: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
          { validator: validateUsername, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
          { validator: validatePassword, trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    setInterval(() => {
      console.log(this.isLogin);
    }, 3000);
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.$refs.form.resetFields();
      if (this.isLogin) {
        this.role = 0;
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.form.validate();
        if (this.isLogin) {
          // 登录逻辑
          const res = await this.$axios.post("/api/user/login", this.form);
          if (res.code === 200) {
            const userData = {
              ...res.data,
            };
            localStorage.setItem("userInfo", JSON.stringify(userData));
            this.$message.success("登录成功");

            if (res.data.role === 1) {
              this.$router.push("/seller/products");
            } else {
              this.$router.push("/");
            }
          }
        } else {
          // 注册逻辑
          const res = await this.$axios.post("/api/user/register", {
            username: this.form.username,
            password: this.form.password,
            confirmPassword: this.form.confirmPassword,
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
          });

          if (res.code === 200) {
            this.$message.success("注册成功,请登录");
            this.isLogin = true;
            this.$refs.form.resetFields();
          }
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-content {
  width: 1000px;
  height: 600px;
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-banner {
  flex: 1;
  position: relative;
  background: #333;
  overflow: hidden;
}

.login-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.banner-text {
  position: absolute;
  bottom: 50px;
  left: 40px;
  color: #fff;
}

.banner-text h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.banner-text p {
  font-size: 16px;
  opacity: 0.8;
}

.login-box {
  width: 440px;
  padding: 40px;
  background: #fff;
  overflow-y: auto;
}

.form-header {
  text-align: left;
  margin-bottom: 30px;
}

.form-header .title {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-header .subtitle {
  font-size: 14px;
  color: #999;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-size: 14px;
  color: #333;
}

:deep(.el-input__inner) {
  height: 45px;
  line-height: 45px;
  border-radius: 8px;
  border-color: #e0e0e0;
}

:deep(.el-input__inner:focus) {
  border-color: #333;
}

:deep(.el-input__prefix) {
  left: 10px;
  color: #999;
}

:deep(.el-input--prefix .el-input__inner) {
  padding-left: 35px;
}

.submit-btn {
  width: 100%;
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 20px;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-button--text) {
  color: #666;
  font-size: 14px;
}

:deep(.el-button--text:hover) {
  color: #333;
}

/* 滚动条样式 */
.login-box::-webkit-scrollbar {
  width: 6px;
}

.login-box::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}

.login-box::-webkit-scrollbar-track {
  background: #f5f5f5;
}

/* 添加下拉框样式 */
:deep(.el-select .el-input__inner) {
  height: 45px;
  line-height: 45px;
  border-radius: 8px;
  border-color: #e0e0e0;
}

:deep(.el-select .el-input__inner:focus) {
  border-color: #333;
}
</style>

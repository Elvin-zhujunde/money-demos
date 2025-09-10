<template>
  <div class="login-container">
    <div class="login-overlay"></div>
    <div class="login-box">
      <div class="logo-area">
        <h1>小刘仓库</h1>
      </div>

      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item v-if="isLogin" prop="role">
          <el-select
            v-model="role"
            placeholder="请选择登录身份"
            style="width: 100%"
          >
            <el-option label="普通用户" :value="0"></el-option>
            <el-option label="管理员" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>

        <template v-if="!isLogin">
          <el-form-item prop="confirmPassword">
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
              <el-form-item prop="name">
                <el-input
                  v-model="form.name"
                  prefix-icon="el-icon-user"
                  placeholder="请输入昵称"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="phone">
                <el-input
                  v-model="form.phone"
                  prefix-icon="el-icon-mobile-phone"
                  placeholder="请输入手机号"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="email">
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
  position: relative;
  background-image: url('../../assets/login-banner.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
}

.login-box {
  position: relative;
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-area {
  text-align: center;
  margin-bottom: 40px;
}

.logo-area h1 {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  margin: 0;
  letter-spacing: 2px;
}

:deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: normal;
}

:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 44px;
  color: #fff;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

:deep(.el-input__inner:hover),
:deep(.el-input__inner:focus) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: none;
}

:deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-select .el-input__inner) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.submit-btn {
  width: 100%;
  height: 44px;
  background: #fff;
  color: #000;
  border: none;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-button--text) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

:deep(.el-button--text:hover) {
  color: #fff;
}

/* 下拉菜单样式 */
:deep(.el-select-dropdown) {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-select-dropdown__item) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-select-dropdown__item.selected) {
  color: #fff;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
}

/* 输入框placeholder */
:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

/* 错误状态 */
:deep(.el-form-item.is-error .el-input__inner) {
  border-color: rgba(255, 77, 79, 0.6);
}

:deep(.el-form-item__error) {
  color: rgba(255, 77, 79, 0.9);
}

/* 适配移动端 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .logo-area h1 {
    font-size: 28px;
  }
}
</style>

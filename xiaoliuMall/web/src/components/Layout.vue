<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <!-- <div class="logo" @click="$router.push('/home')">小刘仓库</div> -->
        <div>
          <!-- <img
            src="./aigologo.jpg"
            height="40"
            alt=""
            @click="$router.push('/home')"
            style="cursor: pointer"
          />
          <img
            src="./aigo.png"
            height="40"
            alt=""
            @click="$router.push('/home')"
            style="cursor: pointer"
          /> -->
          <h2 @click="$router.push('/home')" style="cursor: pointer">小刘仓库</h2>
        </div>
        <search-box></search-box>
        <div class="user-area">
          <template v-if="!userInfo">
            <el-button type="text" @click="toLogin">登录/注册</el-button>
          </template>
          <template v-else>
            <div style="display: flex; align-items: center; gap: 10px">
              <img
                @click="$router.push('/profile')"
                width="40"
                height="40"
                style="border-radius: 50%; cursor: pointer"
                :src="userInfo.avatar"
                alt=""
              />
              <el-button type="text" @click="$router.push('/profile')">{{
                userInfo.name
              }}</el-button>
            </div>
            <el-button type="text" @click="$router.push('/cart')">
              <i class="el-icon-shopping-cart-2"></i>
              购物车
            </el-button>

            <el-button type="text" @click="handleLogout"
              ><i class="el-icon-switch-button"></i> 退出登录</el-button
            >
          </template>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <router-view></router-view>
    </div>

    <!-- 底部版权信息 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 小刘仓库 All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";

export default {
  name: "Layout",
  components: {
    SearchBox,
  },
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.initUserInfo();
  },
  methods: {
    initUserInfo() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
    handleLogout() {
      this.$msgbox({
        message: "确定要退出登录吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 500);
          } else {
            done();
          }
        },
      }).then((action) => {
        localStorage.removeItem("userInfo");
        this.userInfo = null;
        this.$message.success("退出成功");
        this.$router.push("/login");
      });
    },
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.logo:hover {
  color: #555;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-area .el-button {
  font-size: 14px;
  color: #666;
  transition: color 0.3s;
}

.user-area .el-button:hover {
  color: #333;
}

.user-area .el-icon-shopping-cart-2 {
  margin-right: 4px;
}

.main-content {
  flex: 1;
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.footer {
  background: #fff;
  padding: 20px 0;
  margin-top: 40px;
}

.footer-content {
  width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* Element UI 样式覆盖 */
:deep(.el-button--primary) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary:hover) {
  background-color: #555;
  border-color: #555;
}

:deep(.el-button--text) {
  color: #666;
}

:deep(.el-button--text:hover) {
  color: #333;
}
</style>

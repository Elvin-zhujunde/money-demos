<template>
  <div class="seller-layout">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <div class="logo">
          <!-- <img src="../../assets/logo.png" alt="logo" /> -->
          <span class="title">商家管理后台</span>
        </div>
        
        <el-menu
          :router="true"
          :default-active="$route.path"
          mode="horizontal"
          background-color="#fff"
          text-color="#666"
          active-text-color="#ff6700"
        >
          <el-menu-item index="/seller/products">
            <i class="el-icon-goods"></i>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/seller/orders">
            <i class="el-icon-document"></i>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/seller/users">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/seller/banners">
            <i class="el-icon-picture"></i>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/seller/categories">
            <i class="el-icon-menu"></i>
            <span>分类管理</span>
          </el-menu-item>
        </el-menu>

        <div class="user-info">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-dropdown">
              {{ userInfo.name }}
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "SellerLayout",
  data() {
    return {
      userInfo: {},
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
    handleCommand(command) {
      if (command === 'logout') {
        localStorage.removeItem("userInfo");
        this.$router.push("/login");
      }
    }
  },
};
</script>

<style scoped>
.seller-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;
}

.logo img {
  height: 32px;
  margin-right: 10px;
}

.logo .title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.user-info {
  margin-left: auto;
  padding: 0 20px;
}

.user-dropdown {
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-dropdown:hover {
  color: #333;
}

.main-container {
  padding: 80px 20px 20px;
  width: 1200px;
  margin: 0 auto;
}

/* Element UI Menu 样式覆盖 */
:deep(.el-menu) {
  border-bottom: none;
}

:deep(.el-menu-item) {
  font-size: 14px;
  height: 60px;
  line-height: 60px;
}

:deep(.el-menu-item.is-active) {
  color: #ff6700 !important;
  border-bottom: 2px solid #ff6700;
}

:deep(.el-menu-item:hover) {
  background-color: transparent !important;
}

:deep(.el-menu-item i) {
  margin-right: 4px;
  font-size: 16px;
}
</style>

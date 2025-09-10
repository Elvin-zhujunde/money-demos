<template>
  <div class="seller-layout">
    <el-container>
      <el-aside width="200px">
        <div class="store-info">
          <h2 class="store-name">{{ userInfo.name }}</h2>
        </div>
        <el-menu
          :router="true"
          :default-active="$route.path"
          background-color="#fff"
          text-color="#666"
          active-text-color="#333"
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
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
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
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.seller-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.el-container {
  height: 100vh;
}

.el-aside {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-info {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.store-name {
  margin: 0 0 8px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.store-type {
  margin: 0;
  color: #999;
  cursor: pointer;
  margin-top: 12px;
  font-size: 16px;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  font-size: 14px;
}

.el-menu-item i {
  color: #999;
}

.el-menu-item.is-active {
  background-color: #f5f5f5 !important;
}

.el-menu-item:hover {
  background-color: #f5f5f5 !important;
}

.el-main {
  padding: 20px;
}
</style>

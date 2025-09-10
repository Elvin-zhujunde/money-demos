<template>
  <div class="app-container">
    <el-container>
      <el-header v-if="showHeader">
        <div class="header-content">
          <div class="logo">
            <router-link to="/">
              <el-icon><ShoppingBag /></el-icon>
              <span>XX运动商城</span>
            </router-link>
          </div>
          <nav class="nav-menu">
            <router-link to="/">首页</router-link>
            <router-link to="/category">全部商品</router-link>
            <router-link to="/cart">
              <el-icon><ShoppingCart /></el-icon>
              购物车
            </router-link>
            <router-link to="/user">
              <el-icon><User /></el-icon>
              个人中心
            </router-link>
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="login-btn">
                <el-button type="primary" size="small">登录/注册</el-button>
              </router-link>
            </template>
            <template v-else>
              <el-dropdown @command="handleCommand">
                <span class="user-dropdown">
                  {{ userInfo.username }}
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile"
                      >个人信息</el-dropdown-item
                    >
                    <el-dropdown-item command="orders"
                      >我的订单</el-dropdown-item
                    >
                    <el-dropdown-item v-if="isAdmin" command="admin" divided>
                      后台管理
                    </el-dropdown-item>
                    <el-dropdown-item command="logout" divided
                      >退出登录</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </nav>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  ArrowDown,
} from "@element-plus/icons-vue";
import axios from "axios";

const router = useRouter();
const cartCount = ref(0);

const isLoggedIn = computed(() => {
  return localStorage.getItem("user");
});

const userInfo = computed(() => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : {};
});

const isAdmin = computed(() => {
  return userInfo.value.role === "admin";
});

const showHeader = computed(() => {
  return (
    !router.currentRoute.value.path.startsWith("/admin") &&
    router.currentRoute.value.path !== "/login"
  );
});

const handleCommand = (command) => {
  switch (command) {
    case "profile":
      router.push("/user");
      break;
    case "orders":
      router.push("/user");
      break;
    case "admin":
      router.push("/admin");
      break;
    case "logout":
      localStorage.removeItem("user");
      router.push("/login");
      ElMessage.success("已退出登录");
      break;
  }
};

// 获取购物车数量
const fetchCartCount = async () => {
  if (!isLoggedIn.value) return;
  try {
    const { data } = await axios.get("/api/cart", {
      params: { userId: userInfo.value.id },
    });
    cartCount.value = data.length;
  } catch (error) {
    console.error("获取购物车数量失败:", error);
  }
};

onMounted(() => {
  fetchCartCount();
});
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 999;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 22px;
  font-weight: bold;
}

.logo a {
  color: #409eff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-menu a {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #409eff;
}

.nav-menu a.router-link-active {
  color: #409eff;
  font-weight: 500;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
}

.user-dropdown:hover {
  color: #409eff;
}

.el-main {
  padding-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 20px;
  }

  .nav-menu {
    gap: 15px;
  }

  .logo span {
    display: none;
  }
}
</style>

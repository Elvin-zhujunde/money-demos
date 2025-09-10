<template>
  <a-layout class="admin-layout">
    <!-- 侧边栏 -->
    <a-layout-sider>
      <div class="logo">乐娱音乐后台</div>
      <a-menu
        theme="dark"
        mode="inline"
        :selectedKeys="[activeMenu]"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <a-icon type="dashboard" />
          <span>数据面板</span>
        </a-menu-item>
        <a-menu-item key="users">
          <a-icon type="user" />
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="songs">
          <a-icon type="customer-service" />
          <span>歌曲管理</span>
        </a-menu-item>
        <a-menu-item key="playlists">
          <a-icon type="customer-service" />
          <span>歌单管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout>
      <a-layout-header>
        <div class="header-right">
          <span>{{ userInfo.nickname }}</span>
          <a-button type="link" @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>
      
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: 'AdminLayout',
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
    }
  },
  computed: {
    activeMenu() {
      const path = this.$route.path
      const key = path.split('/')[2]
      return key || 'dashboard'
    }
  },
  methods: {
    handleMenuClick({ key }) {
      if (this.$route.path !== `/admin/${key}`) {
        this.$router.push(`/admin/${key}`)
      }
    },
    logout() {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.admin-layout {
  min-height: 100vh;

  .logo {
    height: 64px;
    line-height: 64px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }

  .ant-layout-header {
    background: #fff;
    padding: 0 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .header-right {
      span {
        margin-right: 12px;
      }
    }
  }

  .ant-layout-content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
  }
}
</style> 
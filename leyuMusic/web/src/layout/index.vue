<template>
  <div class="layout">
    <div class="header">
      <div class="header-content">
        <div class="left">
          <h1 class="logo" @click="$router.push('/')">乐娱音乐</h1>
          <a-menu mode="horizontal" :selectedKeys="[current]">
            <a-menu-item key="discover">
              <router-link to="/">发现音乐</router-link>
            </a-menu-item>
            <a-menu-item key="playlist">
              <router-link to="/playlist">歌单</router-link>
            </a-menu-item>
            <a-menu-item key="my-music">
              <router-link to="/my-music">我的音乐</router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="right">
          <a-select
            show-search
            placeholder="搜索音乐"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :auto-clear-search-value="true"
            :value="searchValue"
            @search="handleSearch"
            @select="handleSelect"
            @change="handleChange"
            style="width: 300px; margin-right: 20px;"
          >
            <a-select-option v-for="song in searchResults" :key="song.id" :value="song.id">
              <div class="search-result-item">
                <img :src="song.cover_image" :alt="song.title" class="cover" />
                <div class="info">
                  <div class="title">{{ song.title }}</div>
                  <div class="singer">{{ song.singer_name }}</div>
                </div>
              </div>
            </a-select-option>
          </a-select>
          <template v-if="!isLogin">
            <a-button type="link" @click="openLoginModal">登录</a-button>
          </template>
          <template v-else>
            <a-dropdown>
              <a-avatar
                :src="userInfo.avatar || require('@/assets/default-avatar.png')"
                class="user-avatar"
              />
              <a-menu slot="overlay">
                <a-menu-item key="profile" @click="goToUserProfile">
                  <a-icon type="user" />个人主页
                </a-menu-item>
                <a-menu-item key="logout" @click="handleLogout">
                  <a-icon type="logout" />退出登录
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    <LoginModal :visible.sync="showLoginModal" />
  </div>
</template>

<script>
import LoginModal from "@/components/LoginModal";
import user from "../store/modules/user";

export default {
  name: "Layout",
  components: {
    LoginModal,
  },
  data() {
    return {
      current: "discover",
      showLoginModal: false,
      searchResults: [],
      searchTimeout: null,
      searchValue: undefined
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    },
    isLogin() {
      return !!this.userInfo;
    },
    isAdmin() {
      return this.userInfo?.role === "admin";
    },
  },
  watch: {
    $route: {
      handler(route) {
        this.current = route.path.split("/")[1];
      },
      immediate: true,
    },
  },
  methods: {
    onSearch(value) {
      console.log("搜索:", value);
    },
    openLoginModal() {
      this.showLoginModal = true;
    },
    goToUserProfile() {
      let userinfo = JSON.parse(localStorage.getItem("userInfo")) || null;
      if (!userinfo) {
        this.$message.error("请先登录");
        return;
      }
      this.$router.push(`/user/${userinfo.id}`);
    },
    handleLogout() {
      localStorage.removeItem("userInfo");
      // 如果当前在个人主页，退出后跳转到首页
      if (this.$route.name === "UserProfile") {
        this.$router.push("/");
      }
      // 刷新页面以更新状态
      window.location.reload();
    },
    async handleSearch(value) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      // 防抖处理
      this.searchTimeout = setTimeout(async () => {
        if (!value) {
          this.searchResults = []
          return
        }
        
        try {
          const res = await this.$http.get('/api/songs/search', {
            params: { keyword: value }
          })
          if (res.code === 200) {
            this.searchResults = res.data
          }
        } catch (error) {
          console.error('搜索失败:', error)
        }
      }, 300)
    },
    handleSelect(value) {
      if (this.$route.path === `/song/${value}`) {
        return
      }
      this.$router.push(`/song/${value}`)
      this.searchValue = undefined
      this.searchResults = []
    },
    handleChange() {
      this.searchResults = []
      this.searchValue = undefined
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  min-height: 100vh;
  background-color: #fff;

  .header {
    background: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        .logo {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          margin: 0 40px 0 0;
          font-family: "Microsoft YaHei", sans-serif;
          background: linear-gradient(45deg, #fff, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        :deep(.ant-menu) {
          background: transparent;
          border-bottom: none;
          color: #fff;
          line-height: 64px;

          .ant-menu-item {
            border-bottom: 2px solid transparent;

            a {
              color: #fff;
            }

            &:hover,
            &-selected {
              border-bottom: 2px solid #fff;

              a {
                color: #fff;
              }
            }
          }
        }
      }

      .right {
        display: flex;
        align-items: center;

        :deep(.ant-select) {
          .ant-select-selection {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            
            input {
              color: #fff;
              
              &::placeholder {
                color: rgba(255, 255, 255, 0.5);
              }
            }
          }
        }

        .ant-btn-link {
          color: #fff;
        }

        .ant-avatar {
          cursor: pointer;
        }
      }
    }
  }

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 20px;
  }
}

.user-avatar {
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  
  .cover {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    margin-right: 12px;
    object-fit: cover;
  }
  
  .info {
    flex: 1;
    overflow: hidden;
    
    .title {
      font-size: 14px;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .singer {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>

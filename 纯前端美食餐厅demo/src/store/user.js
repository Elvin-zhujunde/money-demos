import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    setUserInfo(info) {
      this.userInfo = info
    },
    setToken(token) {
      this.token = token
    },
    login(credentials) {
      // 模拟登录API调用
      return new Promise((resolve) => {
        setTimeout(() => {
          const userInfo = {
            id: 1,
            username: credentials.username,
            avatar: 'https://via.placeholder.com/100x100?text=Avatar',
            bio: '美食爱好者'
          }
          this.setUserInfo(userInfo)
          this.setToken('mock-token')
          resolve(userInfo)
        }, 1000)
      })
    },
    logout() {
      this.userInfo = null
      this.token = null
    }
  }
}) 
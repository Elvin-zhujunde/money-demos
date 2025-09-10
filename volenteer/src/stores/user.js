import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAdmin: (state) => state.userInfo?.role >= 1,
    isSuperAdmin: (state) => state.userInfo?.role === 2,
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.userInfo = null;
      this.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
    updateUserInfo(userInfo) {
      const newUserInfo = { ...this.userInfo, ...userInfo }
      this.setUserInfo(newUserInfo)
    }
  },
}); 
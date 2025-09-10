const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('token') || null
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      localStorage.removeItem('userInfo')
    }
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }
}

const getters = {
  isLogin: state => !!state.token,
  userInfo: state => state.userInfo
}

const actions = {
  login({ commit }, { token, userInfo }) {
    commit('SET_TOKEN', token)
    commit('SET_USER_INFO', userInfo)
  },
  logout({ commit }) {
    commit('SET_TOKEN', null)
    commit('SET_USER_INFO', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
} 
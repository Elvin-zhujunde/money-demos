import Vue from 'vue'
import Vuex from 'vuex'
import player from './modules/player'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    user
  }
}) 
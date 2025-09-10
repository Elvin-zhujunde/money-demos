import { createStore } from 'vuex'
import cart from './modules/cart'
import menu from './modules/menu'
import orders from './modules/orders'

export default createStore({
  state: {
    currentView: 'order'
  },
  
  mutations: {
    setCurrentView(state, view) {
      state.currentView = view
    }
  },
  
  modules: {
    cart,
    menu,
    orders
  }
})
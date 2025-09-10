export default {
  namespaced: true,
  state: {
    list: []
  },
  
  mutations: {
    ADD_ORDER(state, order) {
      state.list.push(order)
    },
    UPDATE_STATUS(state, { orderId, status }) {
      const order = state.list.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    }
  },
  
  getters: {
    pendingTables: state => state.list
      .filter(order => order.status === 'pending' || order.status === 'cooking')
      .map(order => order.tableNumber),
    
    getOrderByTable: state => tableNumber => 
      state.list.find(order => 
        order.tableNumber === tableNumber && 
        (order.status === 'pending' || order.status === 'cooking' || order.status === 'ready')
      )
  },
  
  actions: {
    async createOrder({ commit, rootState, getters }) {
      const cartItems = rootState.cart.items
      const tableNumber = rootState.cart.currentTable
      
      if (getters.pendingTables.includes(tableNumber)) {
        throw new Error('该桌号已有未结算订单')
      }
      
      const order = {
        id: Date.now(),
        tableNumber,
        items: JSON.parse(JSON.stringify(cartItems)),
        status: 'pending',
        timestamp: new Date().toISOString(),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
      
      commit('ADD_ORDER', order)
      commit('cart/CLEAR_CART', null, { root: true })
      commit('cart/RESET_TABLE', null, { root: true })
      
      return order
    },
    
    async cookOrder({ commit }, orderId) {
      commit('UPDATE_STATUS', { orderId, status: 'cooking' })
    },

    async serveOrder({ commit }, orderId) {
      commit('UPDATE_STATUS', { orderId, status: 'ready' })
    },
    
    async payOrder({ commit }, orderId) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      commit('UPDATE_STATUS', { orderId, status: 'paid' })
    }
  }
}
export default {
  namespaced: true,
  state: {
    items: [],
    currentTable: ''
  },
  
  mutations: {
    ADD_TO_CART(state, item) {
      const existingItem = state.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
    },
    CLEAR_CART(state) {
      state.items = []
    },
    SET_TABLE(state, tableNumber) {
      state.currentTable = tableNumber
    },
    RESET_TABLE(state) {
      state.currentTable = ''
    }
  },
  
  getters: {
    total: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: state => state.items.length
  }
}
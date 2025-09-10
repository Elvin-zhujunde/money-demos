import menuApi from '../../api/menu'

export default {
  namespaced: true,
  
  state: {
    items: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    ADD_ITEM(state, item) {
      state.items.push(item)
    },
    UPDATE_STOCK(state, { id, quantity }) {
      const item = state.items.find(i => i.id === id)
      if (item) {
        item.stock -= quantity
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchMenuItems({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await menuApi.getMenuList()
        debugger
        commit('SET_ITEMS', response.data.data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addMenuItem({ commit }, itemData) {
      try {
        const response = await menuApi.addMenuItem(itemData)
        commit('ADD_ITEM', response.data.data)
        return response.data.data
      } catch (error) {
        throw new Error(error.message)
      }
    },

    async updateStock({ commit }, { id, quantity }) {
      try {
        await menuApi.updateStock(id, quantity)
        commit('UPDATE_STOCK', { id, quantity })
      } catch (error) {
        throw new Error(error.message)
      }
    }
  }
}
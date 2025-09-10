import axios from 'axios'
import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    travels: [],
    currentTravel: null
  }),
  getters: {
    featuredTravels: (state) =>
      state.travels.filter(travel => travel.featured),
    getTravelById: (state) => (id) =>
      state.travels.find(travel => travel.id === parseInt(id))
  },
  actions: {
    async fetchTravels(state) {
      // 模拟API调用
      axios.get('/data.json').then(res => {


        this.$state.travels = res.data?.travel || []
      })
    },
    async fetchTravelById(id) {
      // 模拟API调用
      return new Promise(resolve => {
        setTimeout(() => {
          const travel = this.getTravelById(id)
          resolve(travel)
        }, 500)
      })
    }
  }
}) 
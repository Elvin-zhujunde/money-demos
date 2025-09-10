import axios from 'axios'

const api = {
  // 获取菜单列表
  getMenuList() {
    return axios.get('/api/menu/list')
  },

  // 添加菜品
  addMenuItem(data) {
    return axios.post('/api/menu/add', data)
  },

  // 更新库存
  updateStock(id, quantity) {
    return axios.put(`/api/menu/stock/${id}`, { quantity })
  }
}

export default api 
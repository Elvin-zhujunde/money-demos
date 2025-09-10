import Mock from 'mockjs'

// 菜品数据
const menuItems = [
  {
    id: 1,
    name: '宫保鸡丁',
    price: 38,
    stock: 20,
    image: 'https://via.placeholder.com/200x200?text=宫保鸡丁'
  },
  {
    id: 2,
    name: '水煮鱼',
    price: 58,
    stock: 15,
    image: 'https://via.placeholder.com/200x200?text=水煮鱼'
  },
  {
    id: 3,
    name: '麻婆豆腐',
    price: 28,
    stock: 30,
    image: 'https://via.placeholder.com/200x200?text=麻婆豆腐'
  },
  {
    id: 4,
    name: '青椒肉丝',
    price: 32,
    stock: 25,
    image: 'https://via.placeholder.com/200x200?text=青椒肉丝'
  },
  {
    id: 5,
    name: '糖醋里脊',
    price: 42,
    stock: 18,
    image: 'https://via.placeholder.com/200x200?text=糖醋里脊'
  }
]

// 获取菜单列表
Mock.mock('/api/menu/list', 'get', {
  code: 200,
  data: menuItems,
  message: 'success'
})

// 添加菜品
Mock.mock('/api/menu/add', 'post', (options) => {
  const newItem = JSON.parse(options.body)
  return {
    code: 200,
    data: {
      id: Date.now(),
      ...newItem
    },
    message: 'success'
  }
})

// 更新库存
Mock.mock(/\/api\/menu\/stock\/\d+/, 'put', (options) => {
  const { quantity } = JSON.parse(options.body)
  return {
    code: 200,
    data: { quantity },
    message: 'success'
  }
}) 
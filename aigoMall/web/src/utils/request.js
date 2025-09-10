import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:9090', // 后端服务地址
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      // 添加 token 到请求头
      if (user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`
      }
      config.headers['user-info'] = encodeURIComponent(userInfo)
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || '错误'))
    }
    return res
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 
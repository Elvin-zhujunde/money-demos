import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from '@/utils/request'

// 修改 Element UI 的默认配置
Vue.use(ElementUI, {
  button: {
    defaultType: 'primary',
    defaultSize: 'small'
  }
})

// 修改全局主题色
const originalTheme = {
  'primary-color': '#333333',
  'success-color': '#67C23A',
  'warning-color': '#E6A23C',
  'danger-color': '#F56C6C',
  'price-color': '#FF6B35'  // 价格使用橙色
}

// 应用主题
Object.keys(originalTheme).forEach(key => {
  document.documentElement.style.setProperty(`--el-color-${key}`, originalTheme[key])
})

Vue.prototype.$axios = request
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 
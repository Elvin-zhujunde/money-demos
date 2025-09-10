import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import store from './store'
import './mock' // 确保在开发环境中使用 mock 数据

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
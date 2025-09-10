import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { highlight } from './directives/highlight'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(Antd)
app.use(pinia)
app.directive('highlight', highlight)
app.mount('#app')

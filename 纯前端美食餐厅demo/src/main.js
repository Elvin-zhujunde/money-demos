import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import { lazyload } from './directives/lazyload'

const app = createApp(App)

app.directive('lazyload', lazyload)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app') 
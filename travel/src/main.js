import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import { vHighlight } from './directives/highlight'
import './style.css'

const app = createApp(App)

app.directive('highlight', vHighlight)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

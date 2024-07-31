import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')

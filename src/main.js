import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
createApp(App).use(createPinia()).use(ElementPlus).mount('#app')

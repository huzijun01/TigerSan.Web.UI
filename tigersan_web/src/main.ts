import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Language, config } from '@/0_tigersan_ui/tigerui'

config.Locale.value = Language.zhCn

const app = createApp(App)

app.use(createPinia())
app.mount('#app')

import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Settings } from './settings'
import { MapModel } from './0_tigersan_ui/tigerui'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

MapModel.LoadAsync(Settings.SecretKey, Settings.AppKey)
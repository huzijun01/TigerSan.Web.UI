import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MapModel } from './models'
import { Settings } from './settings'

await MapModel.LoadAsync(Settings.SecretKey, Settings.AppKey)

const app = createApp(App)

app.use(createPinia())
app.mount('#app')

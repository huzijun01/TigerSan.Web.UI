import './packages/index.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MapModel } from './packages'

await MapModel.LoadAsync('5d24b72820a7a1721f8139816afe6a27', '65f1b313026f2bc883fce4ba5ce626aa')

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
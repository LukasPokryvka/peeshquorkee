import { createApp } from 'vue'
import store from './store/index'
import 'normalize.css'
import './styles/style.scss'
import App from './App.vue'
import mitt from 'mitt'

window.eventBus = mitt()
const app = createApp(App)

app.use(store)
app.mount('#app')

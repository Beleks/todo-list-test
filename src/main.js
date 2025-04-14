import 'vue3-toastify/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Vue3Toastify from 'vue3-toastify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  pauseOnHover: false,
  limit: 2,
  theme: 'dark',
  position: 'bottom-center',
  autoClose: 2000,
})

app.mount('#app')

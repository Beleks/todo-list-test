import 'vue3-toastify/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import Vue3Toastify from 'vue3-toastify'

import App from './App.vue'
import router from './router'

import en from './locales/en'
import ru from './locales/ru'

const app = createApp(App)
const i18n = createI18n({
  locale: 'ru',
  messages: {
    en,
    ru,
  },
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Vue3Toastify, {
  pauseOnHover: false,
  limit: 2,
  theme: 'dark',
  position: 'bottom-center',
  autoClose: 2000,
})

app.mount('#app')

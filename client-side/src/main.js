import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import i18n from './i18n'

// Vuetify 3
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Icons
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Pinia (state management)
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth' // استورد الـ Auth Store

// Router
import router from './router'

//Toast
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButton: true,
  hideProgressBar: false,
  transition: 'Vue-Toastification__bounce',
  toastClassName: 'custom-toast',
  bodyClassName: 'toast-body',
  icon: true
}

// Vuetify Theme Configuration
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi' // Material Design Icons
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#F5F5F5',
          secondary: '#2196F3', //all btns
          error: '#FF5252',
          background: '#FFFFFF', // Light background
          text: '#000000',
          surface: '#FFFFFF' // Cards/forms background
          // ... (other colors)
        }
      },
      dark: {
        colors: {
          primary: '#0f172a',
          'dark-primary': '#283045',
          secondary: '#2196F3', //all btns
          text: '#F5F5F5',
          background: '#1e2936',
          surface: '#0f172a', // Cards/forms background
          'on-surface': '#FFFFFF', // Text on surfaces
          error: '#FF5252'
          // ... (other colors)
        }
      }
    }
  },
  rtl: true
})

// Create and mount the app
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)

const authStore = useAuthStore(pinia) // مرر الـ pinia instance للـ store
authStore.loadUserFromStorage() // استدعاء loadUserFromStorage بعد إنشاء الـ pinia

app.use(vuetify).use(Toast, toastOptions).use(i18n).mount('#app')

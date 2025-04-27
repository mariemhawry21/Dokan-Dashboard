import { createApp } from 'vue'
import './style.css'
import App from './App.vue'






// Vuetify 3
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Icons
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Pinia (state management)
import { createPinia } from 'pinia'

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
          primary: '#3A5BFF',
          secondary: '#3A5BFF',
          error: '#FF5252',
          background: '#FFFFFF', // Light background
          surface: '#FFFFFF' // Cards/forms background
          // ... (other colors)
        }
      },
      dark: {
        colors: {
          primary: '#2E2E48',
          'dark-primary': '#475BE8',
          secondary: '#2E2E48',
          background: '#383854',
          surface: '#2E2E48', // Cards/forms background
          'on-surface': '#FFFFFF', // Text on surfaces
          error: '#FF5252'
          // ... (other colors)
        }
      }
    }
  }
})

// Create and mount the app
createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetify)
  .use(Toast, toastOptions)
  .mount('#app')

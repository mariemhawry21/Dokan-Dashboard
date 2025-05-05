import { createI18n } from 'vue-i18n'
import en from './en.json'
import fr from './fr.json'
import ar from './ar.json'
const i18n = createI18n({
  legacy: false,
  locale: 'en', // default language
  fallbackLocale: 'en', // fallback language if a translation is missing
  messages: {
    en,
    fr,
    ar
  }
})

export default i18n

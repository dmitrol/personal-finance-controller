import ru from './ru'
import en from './en'
import { createI18n } from 'vue-i18n'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    ru,
    en,
  },
})

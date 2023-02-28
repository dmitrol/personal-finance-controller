import ru from './ru'
import { createI18n } from 'vue-i18n'

export default createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru,
  },
})

import i18n from '@/i18n/index.js'

export default {
  getCurrentTime() {
    const date = new Date()
    return `${date.getDate()} ${this.normalizeMonthTitle(
      date.getMonth()
    )} ${date.getFullYear()} ${this.normalizeValue(date.getHours())}:${this.normalizeValue(
      date.getMinutes()
    )}`
  },
  
  normalizeMonthTitle(number) {
    let month = ''
    switch (number) {
      case 0: {
        month = i18n.global.t('date.month.january')
        break
      }
      case 1: {
        month = i18n.global.t('date.month.february')
        break
      }
      case 2: {
        month = i18n.global.t('date.month.march')
        break
      }
      case 3: {
        month = i18n.global.t('date.month.april')
        break
      }
      case 4: {
        month = i18n.global.t('date.month.may')
        break
      }
      case 5: {
        month = i18n.global.t('date.month.june')
        break
      }
      case 6: {
        month = i18n.global.t('date.month.july')
        break
      }
      case 7: {
        month = i18n.global.t('date.month.august')
        break
      }
      case 8: {
        month = i18n.global.t('date.month.september')
        break
      }
      case 9: {
        month = i18n.global.t('date.month.october')
        break
      }
      case 10: {
        month = i18n.global.t('date.month.november')
        break
      }
      case 11: {
        month = i18n.global.t('date.month.december')
        break
      }
      default: {
        month = i18n.global.t('date.month.january')
        break
      }
    }
    return month
  },
  
  normalizeValue(value) {
    if (value < 10) {
      return '0' + value
    } else {
      return value
    }
  }
}



import i18n from '@/i18n/index.js'

export default {
  emptyValueValidator: [
    (value) => value.length > 0 || i18n.global.t('global.empty_value'),
  ],
  emailValidator: [
    (value) =>
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
        value
      ) || i18n.global.t('global.email_input_error'),
  ],
  passwordValidator: [
    (value) =>
      value.length > 3 ||
      i18n.global.t('global.password_min_length', { value: 4 }),
    (value) =>
      value.length < 30 ||
      i18n.global.t('global.password_max_length', { value: 30 }),
  ],
  currencyCodeValidator: [
    (value) =>
      value.length === 3 ||
      i18n.global.t('global.currency_code_error', { value: 3 }),
  ],
  sumValidator: [
    (value) => {
      return +value > 0 || i18n.global.t('global.record_sum_error')
    },
  ],
  emptySelectValidator: [
    (value) => value || i18n.global.t('global.empty_value'),
  ],
  compareBillValidator: (billTitle) => {
    return [
      (value) => value || i18n.global.t('global.empty_value'),
      (value) =>
        value.text !== billTitle || i18n.global.t('global.compare_bill_error'),
    ]
  },
}

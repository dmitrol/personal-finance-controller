class CurrencyDto {
  title
  code
  rate
  main
  constructor(model) {
    this.title = model.title
    this.code = model.code
    this.rate = model.rate || 1
    this.main = model.main || false
    this.rate = +(this?.rate.toFixed(4))
  }

  static resolveCurrency(currency) {
    return new CurrencyDto(currency)
  }
  static resolveCurrencyList(currencyList) {
    return currencyList.map((currency) => {
      return this.resolveCurrency(currency)
    })
  }
}

export { CurrencyDto as default }

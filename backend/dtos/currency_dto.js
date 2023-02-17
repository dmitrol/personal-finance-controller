class CurrencyDto {
  title
  code
  rate
  main
  constructor(model) {
    this.title = model.title
    this.code = model.code.toUpperCase()
    this.rate = model.rate || 1
    this.main = model.main || false
    this.rate = +this.rate.toFixed(4)
  }
}

export { CurrencyDto as default }

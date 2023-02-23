class BillDto {
  id
  title
  currency
  constructor(model) {
    this.id = model._id
    this.title = model.title
    this.currency = model.currency
  }
}

export { BillDto as default }
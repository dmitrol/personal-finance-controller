class BillDto {
  id
  title
  currency_code
  constructor(model) {
    this.id = model._id
    this.title = model.title
    this.currency_code = model.currency
  }

  static resolveBill(bill) {
    return new BillDto(bill)
  }
  static resolveBillList(billList) {
    return billList.map((bill) => {
      return this.resolveBill(bill)
    })
  }
}

export { BillDto as default }

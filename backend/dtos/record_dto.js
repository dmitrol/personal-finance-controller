class RecordDto {
  id
  bill
  category
  type
  transfer
  sum
  created_at
  description
  constructor(model) {
    this.id = model._id
    this.bill = model.bill
    this.category = model.category
    this.transfer = model.transfer
    this.sum = model.sum
    this.type = model.type
    this.created_at = model.created_at
    this.description = model.description
  }
}

export { RecordDto as default }

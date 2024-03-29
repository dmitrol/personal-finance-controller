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
    if (model.transfer) {
      this.transfer = {
        id: model.transfer._id,
        rate: model.transfer.rate,
      }
    } else {
      this.transfer = null
    }

    this.sum = model.sum
    this.type = model.type
    this.created_at = model.created_at
    this.description = model.description
  }

  static resolveRecord(recod) {
    return new RecordDto(recod)
  }
  static resolveRecordList(recordList) {
    return recordList.map((record) => {
      return this.resolveRecord(record)
    })
  }
}

export { RecordDto as default }

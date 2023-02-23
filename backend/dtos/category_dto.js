class CategoryDto {
  id
  title
  income
  expense
  constructor(model) {
    this.id = model._id
    this.title = model.title
    this.income = model.income || true
    this.expense = model.expense || true
  }
}

export { CategoryDto as default }

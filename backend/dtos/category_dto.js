class CategoryDto {
  title
  income
  expense
  constructor(model) {
    this.title = model.title
    this.income = model.income || true
    this.expense = model.expense || true
  }
}

export { CategoryDto as default }

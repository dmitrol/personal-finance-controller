class CategoryDto {
  id
  title
  income
  expense
  constructor(model) {
    this.id = model._id
    this.title = model.title
    this.income = model.income
    this.expense = model.expense
  }

  static resolveCategory(category) {
    return new CategoryDto(category)
  }
  static resolveCategoryList(categoryList) {
    return categoryList.map((category) => {
      return this.resolveCategory(category)
    })
  }
}

export { CategoryDto as default }

import BillDto from '../dtos/bill_dto.js'
import CategoryDto from '../dtos/category_dto.js'
import CurrencyDto from '../dtos/currency_dto.js'

class ProfileDto {
  id
  user_id
  per_page
  currencies
  categories
  bills
  constructor(model) {
    this.id = model._id
    this.user_id = model.user
    this.per_page = model.per_page
    this.currencies = model.currencies
    this.categories = model.categories
    this.bills = model.bills
  }

  static resolveProfile(profile) {
    const dtoCurrencies = CurrencyDto.resolveCurrencyList(profile.currencies)
    const dtoCategories = CategoryDto.resolveCategoryList(profile.categories)
    const dtoBills = BillDto.resolveBillList(profile.bills)
    profile.currencies = dtoCurrencies
    profile.categories = dtoCategories
    profile.bills = dtoBills

    return new ProfileDto(profile)
  }
}

export { ProfileDto as default }

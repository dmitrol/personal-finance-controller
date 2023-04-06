import ProfileModel from '../models/profile.js'
import RecordModel from '../models/recod.js'
import ApiError from '../exceptions/api_error.js'
import ProfileDto from '../dtos/profile_dto.js'
import CurrencyDto from '../dtos/currency_dto.js'
import CategoryDto from '../dtos/category_dto.js'
import BillDto from '../dtos/bill_dto.js'
import collectionHandler from '../helpers/collection-handler.js'

class ProfileService {
  async createProfile(userId, currecyTitle, currecyCode) {
    return await ProfileModel.create({
      user: userId,
      currencies: [
        {
          title: currecyTitle,
          code: currecyCode,
          rate: 1,
          main: true,
        },
      ],
      categories: [],
      per_page: 10,
    })
  }
  async getProfile(userId) {
    const profile = await ProfileModel.findOne({ user: userId }).lean()
    return ProfileDto.resolveProfile(profile)
  }

  async updatePerPage(userId, perPage) {
    const profile = await ProfileModel.findOne({ user: userId })
    profile.per_page = perPage
    await profile.save()
    return ProfileDto.resolveProfile(profile)
  }

  async getCurrency(userId, page, perPage) {
    const profile = await ProfileModel.findOne({ user: userId }).lean()
    const res = collectionHandler.resolveCollectionByPage(
      profile.currencies || [],
      page,
      perPage
    )
    return {
      data: CurrencyDto.resolveCurrencyList(res?.data),
      total: res?.size,
    }
  }

  async getCurrencyByCode(userId, code) {
    const profile = await ProfileModel.findOne({
      user: userId,
    })
    const result = profile.currencies.find((currency) => currency.code === code)
    return result ? CurrencyDto.resolveCurrency(result) : null
  }

  async getMainCurrency(userId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const mainCurrency = profile.currencies.find(
      (currency) => currency.main === true
    )
    return mainCurrency ? CurrencyDto.resolveCurrency(mainCurrency) : null
  }

  async addCurrency(userId, currency) {
    const profile = await ProfileModel.findOne({ user: userId })
    let hasCurrencyCode = false
    let hasBasicCurrency = false
    profile.currencies.forEach((item) => {
      if (item.code === currency.code.toUpperCase()) {
        hasCurrencyCode = true
      }
      if (item.main === true) {
        hasBasicCurrency = true
      }
    })
    if (hasCurrencyCode) {
      throw ApiError.badRequest('Currency with this code already exists', [])
    }
    if (!hasBasicCurrency && !currency.main) {
      currency.main = true
    }
    if (currency.main) {
      profile.currencies.map((item) => {
        item.main = false
        item.rate = +(item.rate / currency.rate).toFixed(4)
      })
      currency.rate = 1
    }
    profile.currencies.push(currency)

    await profile.save()
    return CurrencyDto.resolveCurrencyList(profile.currencies)
  }

  async updateCurrency(userId, code, newCurrency) {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId, 'currencies.code': code },
      {
        $set: {
          'currencies.$.title': newCurrency.title,
          'currencies.$.rate': newCurrency.rate,
        },
      },
      { new: true }
    )
    if (profile === null) {
      throw ApiError.badRequest('Currency not found')
    }
    return CurrencyDto.resolveCurrencyList(profile.currencies)
  }

  async updateMainCurrency(userId, code, newCurrency) {
    const profile = await ProfileModel.findOne({ user: userId })
    profile.currencies.map((item) => {
      if (item.code === code) {
        item.title = newCurrency.title
        item.rate = 1
        item.main = true
      } else {
        item.main = false
        item.rate = +(item.rate / newCurrency.rate).toFixed(4)
      }
    })
    await profile.save()
    return CurrencyDto.resolveCurrencyList(profile.currencies)
  }

  async deleteCurrency(userId, code) {
    const hasBills = await ProfileModel.find({
      user: userId,
      'bills.currency': code,
    })
    if (hasBills.length > 0) {
      throw ApiError.badRequest(
        'This currency used with bill, delete bill at first'
      )
    }
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId, 'currencies.code': code },
      { $pull: { currencies: { code: code }, bills: { currency: code } } },
      { new: true }
    )
    if (profile === null) {
      throw ApiError.badRequest('Currency not found')
    }
    return CurrencyDto.resolveCurrencyList(profile.currencies)
  }

  async getOneCategory(userId, categoryId) {
    const profile = await ProfileModel.findOne({
      user: userId,
    })
    const result = profile.categories.find((category) =>
      category._id.equals(categoryId)
    )
    return result ? CategoryDto.resolveCategory(result) : null
  }

  async getCategory(userId, page, perPage) {
    const profile = await ProfileModel.findOne({ user: userId })
    const res = collectionHandler.resolveCollectionByPage(
      profile.categories || [],
      page,
      perPage
    )
    return {
      data: CategoryDto.resolveCategoryList(res?.data),
      total: res?.size,
    }
  }

  async addCategory(userId, newCategory) {
    const profile = await ProfileModel.findOne({ user: userId })
    const result = profile.categories.find(
      (category) => category.title === newCategory.title
    )
    if (result) {
      throw ApiError.badRequest('Category with this title already exists', [])
    }
    profile.categories.push(newCategory)
    await profile.save()
    return CategoryDto.resolveCategoryList(profile.categories)
  }

  async updateCategory(userId, categoryId, newCategory) {
    const hasCategory = await ProfileModel.findOne({
      user: userId,
      'categories._id': categoryId,
    })
    if (!hasCategory) {
      throw ApiError.badRequest('Category not found', [])
    }
    const hasThisName = hasCategory.categories.find(
      (category) =>
        !category._id.equals(categoryId) && category.title === newCategory.title
    )
    if (hasThisName) {
      throw ApiError.badRequest('Category with this title already exists', [])
    }
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId, 'categories._id': categoryId },
      {
        $set: {
          'categories.$.title': newCategory.title,
          'categories.$.income': newCategory.income,
          'categories.$.expense': newCategory.expense,
        },
      },
      { new: true }
    )
    return CategoryDto.resolveCategoryList(profile.categories)
  }
  async deleteCategory(userId, categoryId) {
    const hasCategory = await ProfileModel.findOne({
      user: userId,
      'categories._id': categoryId,
    })
    if (!hasCategory) {
      throw ApiError.badRequest('Category not found')
    }
    return Promise.all([
      RecordModel.deleteMany({
        profile: hasCategory._id,
        category: categoryId,
      }),
      ProfileModel.findOneAndUpdate(
        { user: userId, 'categories._id': categoryId },
        { $pull: { categories: { _id: categoryId } } },
        { new: true }
      ),
    ])
  }

  async getBills(userId, page, perPage) {
    const profile = await ProfileModel.findOne({ user: userId })
    const res = collectionHandler.resolveCollectionByPage(
      profile.bills || [],
      page,
      perPage
    )
    return {
      data: BillDto.resolveBillList(res?.data),
      total: res?.size,
    }
  }

  async getOneBill(userId, billId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const result = profile.bills.find((bill) => bill._id.equals(billId))
    return result ? BillDto.resolveBill(result) : null
  }

  async addBill(userId, newBill) {
    const profile = await ProfileModel.findOne({ user: userId })
    const hasBillTitle = profile.bills.find(
      (bill) => bill.title === newBill.title
    )
    if (hasBillTitle) {
      throw ApiError.badRequest('Bill with this title already exists', [])
    }
    profile.bills.push(newBill)
    await profile.save()
    return BillDto.resolveBillList(profile.bills)
  }
  async updateBill(userId, billId, newBill) {
    const hasBill = await ProfileModel.findOne({
      user: userId,
      'bills._id': billId,
    })
    if (!hasBill) {
      throw ApiError.badRequest('Bill not found', [])
    }
    const profile = await ProfileModel.findOneAndUpdate(
      { user: userId, 'bills._id': billId },
      {
        $set: {
          'bills.$.title': newBill.title,
          'bills.$.cyrrency': newBill.currency,
        },
      },
      { new: true }
    )
    return BillDto.resolveBillList(profile.bills)
  }
  async deleteBill(userId, billId) {
    const hasBill = await ProfileModel.findOne({
      user: userId,
      'bills._id': billId,
    })
    if (!hasBill) {
      throw ApiError.badRequest('Bill not found')
    }
    return Promise.all([
      RecordModel.deleteMany({ profile: hasBill._id, bill: billId }),
      ProfileModel.findOneAndUpdate(
        {
          user: userId,
          'bills._id': billId,
        },
        { $pull: { bills: { _id: billId } } },
        { new: true }
      ),
    ])
  }
}

export default new ProfileService()

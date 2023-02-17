import ProfileModel from '../models/profile.js'
import ApiError from '../exceptions/api_error.js'

class ProfileService {
  async createProfile(userId) {
    return await ProfileModel.create({
      user: userId,
      currencies: [],
      categories: [],
    })
  }
  async getProfile(userId) {
    return await ProfileModel.findOne({ user: userId })
  }

  async getAllCurrency(userId) {
    const profile = await ProfileModel.findOne({ user: userId })
    return profile.currencies
  }

  async getCurrencyByCode(userId, code) {
    const profile = await ProfileModel.findOne({
      user: userId,
    })
    const result = profile.currencies.find((currency) => currency.code === code)
    return result ? result : null
  }

  async getMainCurrency(userId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const mainCurrency = profile.currencies.find(
      (currency) => currency.main === true
    )
    return mainCurrency ? mainCurrency : null
  }

  async addCurrency(userId, currency) {
    const profile = await ProfileModel.findOne({ user: userId })
    let hasCurrencyCode = false
    let hasBasicCurrency = false
    profile.currencies.forEach((item) => {
      if (item.code === currency.code) {
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

    return await profile.save()
  }

  async updateCurrency(userId, code, newCurrency) {
    const response = await ProfileModel.findOneAndUpdate(
      { user: userId, 'currencies.code': code },
      {
        $set: {
          'currencies.$.title': newCurrency.title,
          'currencies.$.rate': newCurrency.rate,
        },
      },
      { new: true }
    )
    if (response === null) {
      throw ApiError.badRequest('Currency not found')
    }
    return response
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
    return await profile.save()
  }

  async deleteCurrency(userId, code) {
    const response = await ProfileModel.findOneAndUpdate(
      { user: userId, 'currencies.code': code },
      { $pull: { currencies: { code: code } } },
      { new: true }
    )
    if (response === null) {
      throw ApiError.badRequest('Currency not found')
    }
    return response
  }

  async getOneCategory(userId, categoryId) {
    const profile = await ProfileModel.findOne({
      user: userId,
    })
    const result = profile.categories.find((category) =>
      category._id.equals(categoryId)
    )
    return result ? result : null
  }

  async getAllCategory(userId) {
    const profile = await ProfileModel.findOne({ user: userId })
    return profile.categories
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
    return await profile.save()
  }

  async updateCategory(userId, categoryId, newCategory) {
    const profile = await ProfileModel.findOne({
      user: userId,
      'categories._id': categoryId,
    })
    if (!profile) {
      throw ApiError.badRequest('Category not found', [])
    }
    const hasThisName = profile.categories.find(
      (category) =>
        !category._id.equals(categoryId) && category.title === newCategory.title
    )
    if (hasThisName) {
      throw ApiError.badRequest('Category with this title already exists', [])
    }
    const response = await ProfileModel.findOneAndUpdate(
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
    return response
  }
  async deleteCategory(userId, categoryId) {
    const response = await ProfileModel.findOneAndUpdate(
      { user: userId, 'categories._id)': categoryId },
      { $pull: { categories: { _id: categoryId } } },
      { new: true }
    )
    if (response === null) {
      throw ApiError.badRequest('Category not found')
    }
    return response
  }
}

export default new ProfileService()

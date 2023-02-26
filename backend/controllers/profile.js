import profileService from '../services/profile.js'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api_error.js'
import CurrencyDto from '../dtos/currency_dto.js'
import CategoryDto from '../dtos/category_dto.js'

class ProfileController {
  async getProfile(req, res, next) {
    try {
      return res.status(200).json(await profileService.getProfile(req.user.id))
    } catch (e) {
      next(e)
    }
  }
  async getOneCurrency(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const code = req.params.code.toUpperCase()
      return res
        .status(200)
        .json(await profileService.getCurrencyByCode(req.user.id, code))
    } catch (e) {
      next(e)
    }
  }
  async getAllCurrency(req, res, next) {
    try {
      return res
        .status(200)
        .json(await profileService.getAllCurrency(req.user.id))
    } catch (e) {
      next(e)
    }
  }

  async getMainCurrency(req, res, next) {
    try {
      return res
        .status(200)
        .json(await profileService.getMainCurrency(req.user.id))
    } catch (e) {
      next(e)
    }
  }

  async addCurrency(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const currencyDto = new CurrencyDto(req.body)
      return res
        .status(201)
        .json(await profileService.addCurrency(req.user.id, currencyDto))
    } catch (e) {
      next(e)
    }
  }
  async updateCurrency(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const { code } = req.body
      const oldCurrency = await profileService.getCurrencyByCode(
        req.user.id,
        code.toUpperCase()
      )

      const newCurrency = {
        title: req.body.title,
        rate: req.body.rate || 1,
        main: req.body.main || false,
      }

      if (!req.body.main && oldCurrency.main) {
        return next(ApiError.badRequest('Must be one main currency'))
      }
      if (req.body.main && !oldCurrency.main) {
        return res
          .status(201)
          .json(
            await profileService.updateMainCurrency(
              req.user.id,
              code.toUpperCase(),
              newCurrency
            )
          )
      } else {
        return res
          .status(201)
          .json(
            await profileService.updateCurrency(
              req.user.id,
              code.toUpperCase(),
              newCurrency
            )
          )
      }
    } catch (e) {
      next(e)
    }
  }
  async deleteCurrency(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const code = req.body.code.toUpperCase()
      const currency = await profileService.getCurrencyByCode(req.user.id, code)
      if (!currency) {
        return next(ApiError.badRequest('Currency not found'))
      }
      if (currency.main) {
        return next(ApiError.badRequest("Can't delete main currency"))
      }
      return res
        .status(201)
        .json(await profileService.deleteCurrency(req.user.id, code))
    } catch (e) {
      next(e)
    }
  }

  async getOneCategory(req, res, next) {
    try {
      return res
        .status(200)
        .json(await profileService.getOneCategory(req.user.id, req.params.id))
    } catch (e) {
      next(e)
    }
  }

  async getAllCategories(req, res, next) {
    try {
      return res
        .status(200)
        .json(await profileService.getAllCategory(req.user.id))
    } catch (e) {
      next(e)
    }
  }

  async addCategory(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const categoryDto = new CategoryDto(req.body)
      return res
        .status(201)
        .json(await profileService.addCategory(req.user.id, categoryDto))
    } catch (e) {
      next(e)
    }
  }

  async updateCategory(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const data = await profileService.updateCategory(
        req.user.id,
        req.body.category_id,
        {
          title: req.body.title,
          income: req.body.income,
          expense: req.body.expense,
        }
      )
      return res.status(201).json(data)
    } catch (e) {
      next(e)
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      profileService
        .deleteCategory(req.user.id, req.body.category_id)
        .then(() => {
          res.status(201).json({ status: true })
        })
        .catch((e) => {
          next(e)
        })
    } catch (e) {
      next(e)
    }
  }

  async getOneBill(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      return res
        .status(200)
        .json(await profileService.getOneBill(req.user.id, req.params.id))
    } catch (e) {
      next(e)
    }
  }

  async getAllBills(req, res, next) {
    try {
      return res.status(200).json(await profileService.getAllBills(req.user.id))
    } catch (e) {
      next(e)
    }
  }

  async addBill(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      return res.status(200).json(
        await profileService.addBill(req.user.id, {
          title: req.body.title,
          currency: req.body.currency_code,
        })
      )
    } catch (e) {
      next(e)
    }
  }

  async updateBill(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const data = await profileService.updateBill(
        req.user.id,
        req.body.bill_id,
        {
          title: req.body.title,
          currency: req.body.currency_code,
        }
      )
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async deleteBill(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      profileService
        .deleteBill(req.user.id, req.body.bill_id)
        .then(() => {
          res.status(201).json({ status: true })
        })
        .catch((e) => {
          next(e)
        })
    } catch (e) {
      next(e)
    }
  }
}

export default new ProfileController()

import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api_error.js'
import profileService from '../services/profile.js'
import recordSevice from '../services/record.js'

class RecordController {
  async getRecords(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const page = req.query?.page || 1
      const perPage = req.query?.per_page || 10
      const type = req.query?.type || null
      const billId = req.query?.bill_id || null
      return res
        .status(200)
        .json(
          await recordSevice.getRecords(
            req.user.id,
            page,
            perPage,
            type,
            billId
          )
        )
    } catch (e) {
      next(e)
    }
  }

  async getRecorById(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const record = await recordSevice.getRecordById(
        req.user.id,
        req.params.id
      )
      return res.status(200).json(record)
    } catch (e) {
      next(e)
    }
  }

  async addRecord(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const userId = req.user.id
      const bill = await profileService.getOneBill(userId, req.body.bill_id)
      const category = await profileService.getOneCategory(
        userId,
        req.body.category_id
      )
      if (!category) {
        throw ApiError.badRequest('Category not found')
      }
      const data = await recordSevice.addRecord(userId, {
        bill: bill.id,
        category: category.id,
        sum: req.body.sum,
        type: req.body.type,
        created_at: req.body.created_at || Date.now(),
        description: req.body.description || '',
      })
      return res.status(201).json(data)
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
      const userId = req.user.id
      const data = await recordSevice.updateRecord(userId, req.body.record_id, {
        bill: req.body.bill_id,
        category: req.body.category_id,
        sum: req.body.sum,
        created_at: req.body.created_at || Date.now(),
        description: req.body.description || '',
      })
      return res.status(201).json(data)
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
      recordSevice
        .deleteRecord(req.user.id, req.body.record_id)
        .then(() => {
          res.status(201).json({ status: true })
        })
        .catch((err) => {
          next(err)
        })
    } catch (e) {
      next(e)
    }
  }
}
export default new RecordController()

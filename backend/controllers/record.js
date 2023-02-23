import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api_error.js'
import profileService from '../services/profile.js'
import recordSevice from '../services/record.js'
import RecordDto from '../dtos/record_dto.js'

class RecordController {
  async getAllRecords(req, res, next) {
    try {
      const data = await recordSevice.getAllRecords(req.user.id)
      return res.status(200).json(data)
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
      const data = await recordSevice.addRecord(userId, {
        bill: bill,
        category: category,
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
      const data = await recordSevice.deleteRecord(
        req.user.id,
        req.body.record_id
      )
      return res.status(201).json(data)
    } catch (e) {
      next(e)
    }
  }
}
export default new RecordController()

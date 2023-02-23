import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api_error.js'

import transferService from '../services/transfer.js'

class TransferController {
  async getOneTranfer(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      return res
        .status(201)
        .json(await transferService.getTransferById(req.user.id, req.params.id))
    } catch (e) {
      next(e)
    }
  }
  async addTransfer(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const data = await transferService.addTransfer(
        req.user.id,
        {
          bill: req.body.from_bill_id,
          sum: req.body.from_sum,
          type: 'expense',
          created_at: req.body.created_at || Date.now(),
          description: req.body.description,
        },
        {
          bill: req.body.to_bill_id,
          sum: req.body.to_sum,
          type: 'income',
          created_at: req.body.created_at || Date.now(),
          description: req.body.description,
        },
        req.body.transfer_rate
      )
      return res.status(201).json(data)
    } catch (e) {
      next(e)
    }
  }

  async updateTransfer(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const data = await transferService.updateTransfer(
        req.user.id,
        req.body.transfer_id,
        {
          bill: req.body.from_bill_id,
          sum: req.body.from_sum,
          type: 'expense',
          created_at: req.body.created_at || Date.now(),
          description: req.body.description,
        },
        {
          bill: req.body.to_bill_id,
          sum: req.body.to_sum,
          type: 'income',
          created_at: req.body.created_at || Date.now(),
          description: req.body.description,
        },
        req.body.transfer_rate
      )
      return res.status(201).json(data)
    } catch (e) {
      next(e)
    }
  }

  async deleteTransfer(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      return res
        .status(201)
        .json(
          await transferService.deleteTransfer(
            req.user.id,
            req.body.transfer_id
          )
        )
    } catch (e) {
      next(e)
    }
  }
}
export default new TransferController()

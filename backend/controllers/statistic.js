import { validationResult } from 'express-validator'
import statisticService from '../services/statistic.js'

class StatisticController {
  async getStatisticByBills(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(ApiError.validationError(validationErrors.array()))
      }
      const page = req.query?.page || 1
      const perPage = req.query?.per_page || 10
      return res
        .status(200)
        .json(
          await statisticService.getStatisticByBills(req.user.id, page, perPage)
        )
    } catch (e) {
      next(e)
    }
  }
}
export default new StatisticController()

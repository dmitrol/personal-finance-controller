import { Router } from 'express'
import { query } from 'express-validator'
import authMiddleware from '../middlewares/auth_middleware.js'
import statisticController from '../controllers/statistic.js'

const router = new Router()

router.get(
  '/',
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('number not less then 1'),
  query('per_page')
    .optional()
    .isInt({ min: 4 })
    .withMessage('number not less then 4'),
  authMiddleware,
  statisticController.getStatisticByBills
)

export default router

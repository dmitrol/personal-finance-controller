import { Router } from 'express'
import { body, param } from 'express-validator'
import authMiddleware from '../middlewares/auth_middleware.js'
import transferController from '../controllers/transfer.js'

const router = new Router()

router.get(
  '/:id',
  param('id').notEmpty().withMessage('not param'),
  authMiddleware,
  transferController.getOneTranfer
)

router.post(
  '/',
  body('from_bill_id').notEmpty().withMessage('not param'),
  body('from_sum').isNumeric().withMessage('not a number'),
  body('to_bill_id').notEmpty().withMessage('not param'),
  body('to_sum').isNumeric().withMessage('not a number'),
  body('transfer_rate').isNumeric().withMessage('not a number'),
  body('created_at').optional().isDate().withMessage('must be date'),
  body('description').optional(),
  authMiddleware,
  transferController.addTransfer
)

router.put(
  '/',
  body('transfer_id').notEmpty().withMessage('not param'),
  body('from_bill_id').notEmpty().withMessage('not param'),
  body('from_sum').isNumeric().withMessage('not a number'),
  body('to_bill_id').notEmpty().withMessage('not param'),
  body('to_sum').isNumeric().withMessage('not a number'),
  body('transfer_rate').isNumeric().withMessage('not a number'),
  body('created_at').optional().isDate().withMessage('must be date'),
  body('description').optional(),
  authMiddleware,
  transferController.updateTransfer
)

router.delete(
  '/',
  body('transfer_id').notEmpty().withMessage('not param'),
  authMiddleware,
  transferController.deleteTransfer
)

export default router

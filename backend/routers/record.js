import { Router } from 'express'
import { body, param, query } from 'express-validator'
import authMiddleware from '../middlewares/auth_middleware.js'
import recordController from '../controllers/record.js'

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
  recordController.getRecords
),
  router.get(
    '/:id',
    param('id').notEmpty().withMessage('not param'),
    authMiddleware,
    recordController.getRecorById
  )
router.post(
  '/',
  body('bill_id').notEmpty().withMessage('not param'),
  body('category_id').notEmpty().withMessage('not param'),
  body('sum').isNumeric().withMessage('not a number'),
  body('type').notEmpty().withMessage('not param'),
  body('created_at').optional().isDate().withMessage('must be date'),
  body('description').optional(),
  authMiddleware,
  recordController.addRecord
)
router.put(
  '/',
  body('record_id').notEmpty().withMessage('not param'),
  body('bill_id').notEmpty().withMessage('not param'),
  body('category_id').notEmpty().withMessage('not param'),
  body('sum').isNumeric().withMessage('not a number'),
  body('created_at').isDate().withMessage('must be date'),
  body('description').optional(),
  authMiddleware,
  recordController.updateBill
)
router.delete(
  '/',
  body('record_id').notEmpty().withMessage('not param'),
  authMiddleware,
  recordController.deleteBill
)

export default router

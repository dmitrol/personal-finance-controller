import { Router } from 'express'
import { body, param } from 'express-validator'
import authMiddleware from '../middlewares/auth_middleware.js'
import profileController from '../controllers/profile.js'
const router = new Router()

router.get('/', authMiddleware, profileController.getProfile)

// currency
router.get('/currency', authMiddleware, profileController.getAllCurrency)
router.get(
  '/currency/:code',
  param('code').isLength({ min: 3, max: 3 }),
  authMiddleware,
  profileController.getOneCurrency
)
router.get('/main-currency', authMiddleware, profileController.getMainCurrency)

router.post(
  '/currency',
  body('title').notEmpty().withMessage('empty title'),
  body('code').isLength({ min: 3, max: 3 }).withMessage('must be 3 characters'),
  body('rate').optional().isNumeric().withMessage('not a number'),
  body('main').optional().isBoolean().withMessage('must be boolean'),
  authMiddleware,
  profileController.addCurrency
)
router.put(
  '/currency',
  body('code').isLength({ min: 3, max: 3 }).withMessage('must be 3 characters'),
  body('title').notEmpty().withMessage('empty title'),
  body('rate').optional().isNumeric().withMessage('not a number'),
  body('main').optional().isBoolean().withMessage('must be boolean'),
  authMiddleware,
  profileController.updateCurrency
)

router.delete(
  '/currency',
  body('code').isLength({ min: 3, max: 3 }).withMessage('must be 3 characters'),
  authMiddleware,
  profileController.deleteCurrency
)

// category 
router.get('/category', authMiddleware, profileController.getAllCategories)
router.get('/category/:id', authMiddleware, profileController.getOneCategory)
router.post(
  '/category',
  body('title').notEmpty().withMessage('empty title'),
  body('income').optional().isBoolean().withMessage('must be boolean'),
  body('expense').optional().isBoolean().withMessage('must be boolean'),
  authMiddleware,
  profileController.addCategory
)
router.put(
  '/category',
  body('id').notEmpty().withMessage('not param'),
  body('title').notEmpty().withMessage('empty title'),
  body('income').isBoolean().withMessage('must be boolean'),
  body('expense').isBoolean().withMessage('must be boolean'),
  authMiddleware,
  profileController.updateCategory
)
router.delete(
  '/category',
  body('id').notEmpty().withMessage('not param'),
  authMiddleware,
  profileController.deleteCategory
)

export default router

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import authMiddleware from '../middlewares/auth_middleware.js'
import profileController from '../controllers/profile.js'
const router = new Router()

router.get('/', authMiddleware, profileController.getProfile)
router.post(
  '/update-per-page',
  body('per_page')
    .isInt({ min: 4, max: 100 })
    .withMessage('must be number from 4 to 100'),
  authMiddleware,
  profileController.updatePerPage
)
router.post(
  '/locale',
  body('locale').notEmpty().withMessage('empty title'),
  authMiddleware,
  profileController.updateLocale
)

// currency
router.get(
  '/currency',
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('number not less then 1'),
  query('per_page')
    .optional()
    .isInt({ min: 4 })
    .withMessage('number not less then 4'),
  authMiddleware,
  profileController.getCurrency
)
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
router.get(
  '/category',
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('number not less then 1'),
  query('per_page')
    .optional()
    .isInt({ min: 4 })
    .withMessage('number not less then 4'),
  authMiddleware,
  profileController.getCategories
)
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
  body('category_id').notEmpty().withMessage('not param'),
  body('title').notEmpty().withMessage('empty title'),
  body('income').isBoolean().withMessage('must be boolean'),
  body('expense').isBoolean().withMessage('must be boolean'),
  authMiddleware,
  profileController.updateCategory
)
router.delete(
  '/category',
  body('category_id').notEmpty().withMessage('not param'),
  authMiddleware,
  profileController.deleteCategory
)

router.get(
  '/bill',
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('number not less then 1'),
  query('per_page')
    .optional()
    .isInt({ min: 4 })
    .withMessage('number not less then 4'),
  authMiddleware,
  profileController.getBills
),
  router.get('/bill/:id', authMiddleware, profileController.getOneBill)
router.post(
  '/bill',
  body('title').notEmpty().withMessage('empty title'),
  body('currency_code')
    .isLength({ min: 3, max: 3 })
    .withMessage('must be 3 characters'),
  authMiddleware,
  profileController.addBill
)
router.put(
  '/bill',
  body('bill_id').notEmpty().withMessage('empty title'),
  body('title').notEmpty().withMessage('empty title'),
  body('currency_code')
    .isLength({ min: 3, max: 3 })
    .withMessage('must be 3 characters'),
  authMiddleware,
  profileController.updateBill
)
router.delete(
  '/bill',
  body('bill_id').notEmpty().withMessage('empty title'),
  authMiddleware,
  profileController.deleteBill
)
export default router

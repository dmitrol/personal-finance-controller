import { Router } from 'express'
import { body } from 'express-validator'

import authMiddleware from '../middlewares/auth_middleware.js'

import authController from '../controllers/auth.js'

const router = new Router()

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 32 }),
  body('currecy_title')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('max 30 characters'),
  body('currecy_code')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('must be 3 characters'),
  authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)

// testing endpoint
router.get('/users', authMiddleware, authController.getUsers)

export default router

import { Router } from 'express'
import { body } from 'express-validator'

import authMiddleware from '../middlewares/auth_middleware.js'

import authController from '../controllers/auth.js'

const router = new Router()

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 32 }),
  authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)

// testing endpoint
router.get('/users', authMiddleware, authController.getUsers)

export default router

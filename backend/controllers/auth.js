import * as dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import userService from '../services/user.js'
import profileService from '../services/profile.js'
import ApiError from '../exceptions/api_error.js'

dotenv.config()

class UserController {
  async registration(req, res, next) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return next(
          ApiError.badRequest('Ошыбка валидации', validationErrors.array())
        )
      }
      const { email, password } = req.body
      const result = await userService.registration(email, password)
      setRefreshToken(res, result.refreshToken)
      const profile = await profileService.createProfile(result.user.id)
      return res.status(200).json({ user: result, profile: profile })
    } catch (e) {
      next(e)
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const data = await userService.login(email, password)
      setRefreshToken(res, data.refreshToken)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const result = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(result)
    } catch (e) {
      next(e)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      if (!refreshToken) {
        throw ApiError.UnauthorizedError()
      }
      const result = await userService.refresh(refreshToken)
      setRefreshToken(res, result.refreshToken)
      return res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
  async getUsers(request, responce, next) {
    try {
      return responce.json(await userService.getAllUsers())
    } catch (e) {
      next(e)
    }
  }
}

function setRefreshToken(res, refreshToken) {
  const DAYS_END = process.env.REFRESH_TOKEN_DAYS_END || 30
  res.cookie('refreshToken', refreshToken, {
    maxAge: DAYS_END * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
}

export default new UserController()

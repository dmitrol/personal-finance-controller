import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import TokenModel from '../models/token.js'

dotenv.config()

class TokenService {
  generateTokens(payload) {
    const ACCESS_TOKEN_END = process.env.ACCESS_TOKEN_MINUTES_END || 30
    const REFRESH_TOKEN_END = process.env.REFRESH_TOKEN_DAYS_END || 30
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: `${ACCESS_TOKEN_END}m`,
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: `${REFRESH_TOKEN_END}d`,
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async seveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await TokenModel.create({ user: userId, refreshToken })
    return token
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch (e) {
      return null
    }
  }
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (e) {
      return null
    }
  }
  async findToken(refreshToken) {
    const result = await TokenModel.findOne({ refreshToken })
    return result
  }

  async removeToken(refreshToken) {
    const result = await TokenModel.deleteOne({ refreshToken })
    return result
  }
}

export default new TokenService()

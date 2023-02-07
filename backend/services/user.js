import bcrypt from 'bcrypt'
import UserDto from '../dtos/user_dto.js'
import UserModel from '../models/user.js'
import TokenService from '../services/token.js'
import ApiError from '../exceptions/api_error.js'

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.badRequest('Указанный email уже используется', [])
    }
    const hashPassword = await bcrypt.hash(password, 2)
    const result = await UserModel.create({ email, password: hashPassword })

    return await createRefreshTokenForUser(result)
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.badRequest('Пароль или email не верный')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.badRequest('Пароль или email не верный')
    }
    return await createRefreshTokenForUser(user)
  }
  async logout(refreshToken) {
    const result = await TokenService.removeToken(refreshToken)
    return result
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const validationResult = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = TokenService.findToken(refreshToken)

    if (!validationResult || !tokenFromDatabase) {
      throw ApiError.UnauthorizedError()
    }

    const user = await UserModel.findById(validationResult.id)
    return await createRefreshTokenForUser(user)
  }

  async getAllUsers() {
    const result = await UserModel.find()
    return result
  }
}

async function createRefreshTokenForUser(user) {
  const userDto = new UserDto(user)
  const tokens = TokenService.generateTokens({ ...userDto })

  await TokenService.seveToken(userDto.id, tokens.refreshToken)

  return {
    ...tokens,
    user: userDto,
  }
}

export default new UserService()

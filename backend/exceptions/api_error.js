class ApiError extends Error {
  status
  errors
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User not authorized')
  }
  static badRequest(message, errors) {
    return new ApiError(400, message, errors)
  }
  static validationError(errors) {
    return new ApiError(400, 'Validation error', errors)
  }
}

export { ApiError as default }

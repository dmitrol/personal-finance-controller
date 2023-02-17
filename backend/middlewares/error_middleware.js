import ApiError from '../exceptions/api_error.js'

function errorMiddleware(error, request, response, next) {
  if (error instanceof ApiError) {
    return response
      .status(error.status)
      .json({ message: error.message, errors: error.errors })
  } else {
    return response.status(500).json({ message: 'Unknown error' })
  }
}

export default errorMiddleware

class CustomError extends Error {
  constructor({ message, status }){
    super(message)
    this.status = status
  }
}

const ERROR = {
  INVALID_FIELDS: () => { throw new CustomError({ message: 'Invalid fields', status: 400 }) },
  BAD_EMAIL: () => { throw new CustomError({ message: 'Error sending email', status: 400 }) },
  FORBIDDEN: () => { throw new CustomError({ message: 'Not allowed', status: 403 }) },
  NOT_FOUND: () => { throw new CustomError({ message: 'Not found', status: 404 }) },
  USER_ALREADY_EXISTS: () => { throw new CustomError({ message: 'User already exists', status: 409 }) },
  SERVICE_UNAVAILABLE: () => { throw new CustomError({ message: 'Service unavailable', status: 503 }) },
  PRODUCT_HAS_STOCK: () => { throw new CustomError({ message: 'Product has stock', status: 409 }) },
  USER_INACTIVE: () => { throw new CustomError({ message: 'This user is not active, contact your administrator', status: 403 }) },
}

export default ERROR
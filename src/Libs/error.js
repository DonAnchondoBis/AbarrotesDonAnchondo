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
  EMAIL_ALREADY_EXISTS: () => { throw new CustomError({ message: 'Email already exists', status: 409 }) }
}

export default ERROR
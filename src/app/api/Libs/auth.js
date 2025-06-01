import jwt from 'jsonwebtoken'

export const authenticateToken = ({ headers }) => {
  const authHeader = headers.get('authorization')
  const token = authHeader && authHeader.replace(/Bearer /,'')
  if (token) {
    const { userId, role } = jwt.verify(token, process.env.JWT_SECRET)
    return { userId, role }
  }
  return null
}


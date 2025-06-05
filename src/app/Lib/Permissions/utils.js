import { useData } from '~/app/store/useData'
import { useToken } from '~/app/store/useToken'

const isValidRole = ({ role, roleRequired }) => {
  if (role === 'ADMIN') return true
  if (role === roleRequired) return true
  return false
}

const usePermmitted = ({ roleRequired = 'ADMIN' }) => {
  const { token } = useToken()
  const { userId, role } = useData()

  if (token && userId && isValidRole({ role, roleRequired }) ) return true

  return false
}

export default usePermmitted
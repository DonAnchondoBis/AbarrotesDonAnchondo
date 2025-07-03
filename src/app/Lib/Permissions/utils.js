import { useData } from '~/app/store/useData'
import { useToken } from '~/app/store/useToken'

const isValidRole = ({ role, roleRequired }) => {
  if (role === 'ADMIN') return true
  if (Array.isArray(roleRequired)) {
    return roleRequired.includes(role)
  }
  return role === roleRequired
}

const usePermitted = ({ roleRequired = 'ADMIN' }) => {
  const { token } = useToken()
  const { userId, role } = useData()

  if (token && userId && isValidRole({ role, roleRequired })) return true

  return false
}

export default usePermitted
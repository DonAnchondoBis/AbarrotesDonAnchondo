import { describe, it, expect, vi } from 'vitest'

// Mock the dependencies before importing the module
vi.mock('~/app/store/useToken', () => ({
  useToken: vi.fn()
}))

vi.mock('~/app/store/useData', () => ({
  useData: vi.fn()
}))

// Import after mocks
import usePermmitted from '../utils'
import { useToken } from '~/app/store/useToken'
import { useData } from '~/app/store/useData'

// Copy of the internal function for direct testing
const isValidRole = ({ role, roleRequired }) => {
  if (role === 'ADMIN') return true
  if (role === roleRequired) return true
  return false
}

describe('isValidRole', () => {
  it.each([
    {
      descr: 'Returns true when role is ADMIN',
      role: 'ADMIN',
      roleRequired: 'CASHIER',
      expected: true
    },
    {
      descr: 'Returns true when role matches roleRequired',
      role: 'CASHIER',
      roleRequired: 'CASHIER',
      expected: true
    },
    {
      descr: 'Returns false when role is not ADMIN and does not match roleRequired',
      role: 'CASHIER',
      roleRequired: 'WAREHOUSE',
      expected: false
    },
    {
      descr: 'Returns false when role is undefined',
      role: undefined,
      roleRequired: 'WAREHOUSE',
      expected: false
    }
  ])('$descr', ({ role, roleRequired, expected }) => {
    expect(isValidRole({ role, roleRequired })).toBe(expected)
  })
})

describe('usePermmitted', () => {
  it.each([
    {
      descr: 'Returns true when token exists, userId exists, and role is ADMIN',
      token: 'valid-token',
      userId: 1,
      role: 'ADMIN',
      roleRequired: 'CASHIER',
      expected: true
    },
    {
      descr: 'Returns true when token exists, userId exists, and role matches roleRequired',
      token: 'valid-token',
      userId: 1,
      role: 'CASHIER',
      roleRequired: 'CASHIER',
      expected: true
    },
    {
      descr: 'Returns false when token does not exist',
      token: null,
      userId: 1,
      role: 'ADMIN',
      roleRequired: 'ADMIN',
      expected: false
    },
    {
      descr: 'Returns false when userId does not exist',
      token: 'valid-token',
      userId: null,
      role: 'ADMIN',
      roleRequired: 'ADMIN',
      expected: false
    },
    {
      descr: 'Returns false when role is not ADMIN and does not match roleRequired',
      token: 'valid-token',
      userId: 1,
      role: 'CASHIER',
      roleRequired: 'WAREHOUSE',
      expected: false
    }
  ])('$descr', ({ token, userId, role, roleRequired, expected }) => {
    useToken.mockReturnValue({ token })
    useData.mockReturnValue({ userId, role })

    const result = usePermmitted({ roleRequired })
    expect(result).toBe(expected)
  })
})
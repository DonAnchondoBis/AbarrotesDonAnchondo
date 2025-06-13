import { describe, it, expect, vi } from 'vitest'
import { authenticateToken } from '~/app/api/Libs/auth'

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      verify: () => ({ userId: 1, role: 'admin' })
    }
  }
})

describe('auth libs', () =>{
  it.each([
    {
      descr: 'Allowed Token',
      headers: new Headers({ 'authorization': 'token' }),
      mockImplementation: { userId: 1, role: 'admin' },
      isAllowed: true,
      result: { userId: 1, role: 'admin' }
    },
    {
      descr: 'Not Token',
      headers: new Headers({ 'not-authorization': 'token' }),
      isAllowed: false,
      result: null
    }
  ])('$descr', async ({ headers, result }) => {
    expect(authenticateToken({ headers })).toEqual(result)
  })
})
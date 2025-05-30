import { describe, it, expect, vi } from 'vitest'
import { authenticateToken } from '~/app/api/Libs/auth'

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      verify: () => ({ professorId: 1 })
    }
  }
})

describe('auth libs', () =>{
  it.each([
    {
      descr: 'Allowed Token',
      headers: new Headers({ 'authorization': 'token' }),
      mockImplementation: { professorId: 1 },
      isAllowed: true,
      result: 1
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
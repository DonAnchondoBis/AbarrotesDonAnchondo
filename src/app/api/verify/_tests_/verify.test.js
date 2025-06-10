import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '~/app/api/verify/route'
import { authenticateToken } from '~/app/api/Libs/auth'

vi.mock('~/app/api/Libs/auth', () => ({
  authenticateToken: vi.fn()
}))

afterEach(() => {
  vi.resetAllMocks()
})

describe('API Verify - GET', () => {
  it.each([
    {
      descr: 'should return userId and role when token is valid',
      mock: () => authenticateToken.mockReturnValue({ userId: 1, role: 'ADMIN' }),
      expectedStatus: 200,
      expectedResponse: { userId: 1, role: 'ADMIN' }
    },
    {
      descr: 'should return forbidden when token is invalid',
      mock: () => authenticateToken.mockReturnValue({}),
      expectedStatus: 403,
      expectedResponse: expect.objectContaining({ error: expect.any(String) })
    },
    {
      descr: 'should return error if authenticateToken throws',
      mock: () => authenticateToken.mockImplementation(() => { throw new Error('Token error') }),
      expectedStatus: 401,
      expectedResponse: { error: 'Token error' }
    }
  ])('$descr', async ({ mock, expectedStatus, expectedResponse }) => {
    mock()
    const req = {}
    const res = await GET(req)
    const data = await res.json()
    expect(res.status).toBe(expectedStatus)
    if (expectedResponse instanceof Object && expectedResponse.asymmetricMatch) {
      expect(data).toEqual(expectedResponse)
    } else {
      expect(data).toEqual(expectedResponse)
    }
  })
})
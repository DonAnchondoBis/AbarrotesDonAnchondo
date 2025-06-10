import { describe, it, expect, vi } from 'vitest'
import { GET } from '~/app/api/verify/route'
import { authenticateToken } from '~/app/api/Libs/auth'

vi.mock('~/app/api/Libs/auth', () => ({
  authenticateToken: vi.fn()
}))

afterEach(() => {
  vi.resetAllMocks()
})

describe('API Verify - GET', () => {
  it('should return userId and role when token is valid', async () => {
    authenticateToken.mockReturnValue({ userId: 1, role: 'ADMIN' })
    const req = {}
    const res = await GET(req)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toEqual({ userId: 1, role: 'ADMIN' })
  })

  it('should return forbidden when token is invalid', async () => {
    authenticateToken.mockReturnValue({})
    const req = {}
    const res = await GET(req)
    const data = await res.json()
    expect(res.status).toBe(403)
    expect(data).toHaveProperty('error')
  })

  it('should return error if authenticateToken throws', async () => {
    authenticateToken.mockImplementation(() => { throw new Error('Token error') })
    const req = {}
    const res = await GET(req)
    const data = await res.json()
    expect(res.status).toBe(401)
    expect(data).toEqual({ error: 'Token error' })
  })
})
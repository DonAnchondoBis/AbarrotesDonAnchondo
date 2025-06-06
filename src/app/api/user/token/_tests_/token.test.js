import { POST } from '../route'
import jwt from 'jsonwebtoken'
import { describe, it, expect, vi } from 'vitest'

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}))

describe('POST /api/user/token', () => {
  const mockRequest = body => ({
    json: vi.fn().mockResolvedValue(body)
  })

  it('should return valid: true and decoded payload for a valid token', async () => {
    const token = 'validToken'
    const decodedPayload = { userId: 1, role: 'USER' }
    jwt.verify.mockReturnValue(decodedPayload)

    const request = mockRequest({ token })
    const response = await POST(request)
    const result = await response.json()

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
    expect(result).toEqual({ valid: true, decoded: decodedPayload })
    expect(response.status).toBe(200)
  })

  it('should return valid: false for an invalid token', async () => {
    const token = 'invalidToken'
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const request = mockRequest({ token })
    const response = await POST(request)
    const result = await response.json()

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
    expect(result).toEqual({ valid: false, error: 'Invalid token' })
    expect(response.status).toBe(401)
  })

  it('should return an error for missing token', async () => {
    const request = mockRequest({})
    const response = await POST(request)
    const result = await response.json()

    expect(result).toEqual({ valid: false, error: 'Invalid fields' })
    expect(response.status).toBe(400)
  })
})
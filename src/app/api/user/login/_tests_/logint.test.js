/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST } from '../route'

// Mock prisma
vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(({ where }) => {
          if (where.username === 'user') {
            return {
              id: 1,
              username: 'user',
              password: 'hashed',
              role: 'admin'
            }
          }
          return null
        })
      }
    }
  }
})

// Mock bcrypt
vi.mock('bcryptjs', () => {
  return {
    default: {
      compare: vi.fn(password => password === 'pass')
    }
  }
})

// Mock jwt
vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn(() => 'mocked.jwt.token')
    }
  }
})

// Mock ERROR
vi.mock('~/Libs/error', () => {
  return {
    default: {
      INVALID_FIELDS: vi.fn(() => ({
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid fields' })
      })),
      NOT_FOUND: vi.fn(() => ({
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      }))
    }
  }
})

describe('API User Login - POST', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'secret'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    {
      descr: 'Missing credentials',
      request: { username: '', password: '' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'User not found',
      request: { username: 'nonexistent', password: 'pass' },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Invalid password',
      request: { username: 'user', password: 'wrong' },
      expectedStatus: 401,
      expectedResponse: { error: 'Invalid credentials' }
    },
    {
      descr: 'Successful login',
      request: { username: 'user', password: 'pass' },
      expectedStatus: 200,
      expectedResponse: { token: 'mocked.jwt.token' }
    }
  ])('$descr', async ({ request: reqBody, expectedStatus, expectedResponse }) => {
    const request = { json: async () => reqBody }
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })

  it('returns 500 on server error', async () => {
    const error = new Error('fail')
    const request = { json: vi.fn().mockRejectedValue(error) }
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({ error: 'fail' })
  })
})
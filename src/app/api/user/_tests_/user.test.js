/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/user/route'

// Mock prisma
vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      user: {
        findMany: vi.fn(() => [
          {
            id: 1,
            username: 'admin',
            password: 'hashedpassword',
            email: 'admin@example.com',
            role: 'ADMIN',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          },
          {
            id: 2,
            username: 'user',
            password: 'hashedpassword',
            email: 'user@example.com',
            role: 'USER',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          }
        ]),
        findUnique: vi.fn(({ where }) =>
          where.username === 'existinguser' ? {
            id: 3,
            username: 'existinguser',
            password: 'hashedpassword',
            email: 'existing@example.com',
            role: 'USER',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          } : null
        ),
        create: vi.fn(({ data }) => ({
          id: 3,
          ...data,
          password: 'hashedpassword',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
        }))
      }
    }
  }
})

// Mock authentication
vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})


vi.mock('bcryptjs', () => {
  return {
    default: {
      hash: vi.fn(() => 'hashedpassword')
    }
  }
})

// Mock validator fields
vi.mock('~/app/api/Libs/validatorFields', () => {
  return {
    default: ({ data, shape }) =>
      data && data.username && data.password && data.role
      && (Array.isArray(shape) || typeof shape === 'object')
  }
})

describe('API User - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
        {
          id: 2,
          username: 'user',
          email: 'user@example.com',
          role: 'USER',
        }
      ]
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }

    const request = {}
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API User - POST', () => {
  it.each([
    {
      descr: 'Successful user creation',
      request: {
        username: 'newuser',
        password: 'password123',
        role: 'USER'
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        name: 'newuser',
        username: 'newuser',
        role: 'USER',
        active: true
      }
    },
    {
      descr: 'Error has not permission',
      request: {
        username: 'newuser',
        password: 'password123',
        email: 'new@example.com',
        role: 'USER'
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error invalid fields',
      request: {
        username: 'newuser',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error username already exists',
      request: {
        username: 'existinguser',
        password: 'password123',
        email: 'another@example.com',
        role: 'USER'
      },
      expectedStatus: 409,
      expectedResponse: { error: 'Username already exists' }
    }
  ])('$descr', async ({ request: reqBody, expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }

    const request = { json: async () => reqBody }
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})
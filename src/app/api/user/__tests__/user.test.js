/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/user/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      user: {
        findMany: ({ where } = {}) => {
          const allUsers = [
            {
              id: 1,
              name: 'Admin User',
              username: 'admin',
              role: 'ADMIN',
              active: true,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt',
            },
            {
              id: 2,
              name: 'Cashier User',
              username: 'cashier',
              role: 'CASHIER',
              active: true,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt',
            },
            {
              id: 3,
              name: 'Inactive User',
              username: 'inactive',
              role: 'CASHIER',
              active: false,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt',
            },
          ]

          if (where && where.active !== undefined) {
            return allUsers.filter(user => user.active === where.active)
          }
          return allUsers
        },
        findUnique: () => null,
        create: ({ data }) => ({
          id: 1,
          name: data.name,
          username: data.username,
          role: data.role,
          active: true,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        }),
      },
    },
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

describe('API User - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse:[
        {
          id: 1,
          name: 'Admin User',
          username: 'admin',
          role: 'ADMIN',
          active: true,
        },
        {
          id: 2,
          name: 'Cashier User',
          username: 'cashier',
          role: 'CASHIER',
          active: true,
        },
      ],
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error fetching users',
      mockImplementation: new Error('Error fetching users'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching users' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'findMany').mockReturnValueOnce([])
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API User - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'New User',
        username: 'newuser',
        password: 'password123',
        role: 'CASHIER',
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'New User',
        username: 'newuser',
        role: 'CASHIER',
        active: true,
      }
    },
    {
      descr: 'Error creating user',
      request: {
        name: 'New User',
        username: 'newuser',
        password: 'password123',
        role: 'CASHIER',
      },
      mockImplementation: new Error('Error creating user'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error creating user' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'New User',
        username: 'newuser',
        password: 'password123',
        role: 'CASHIER',
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Error invalid input',
      request: {
        name: 'New User',
        username: 'newuser',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'User already exists',
      request: {
        name: 'user exists',
        username: 'userexists',
        password: 'password123',
        role: 'CASHIER',
      },
      expectedStatus: 409,
      expectedResponse: { error: 'User already exists' },
      userExists: true,
    },
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, userExists }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (userExists) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'findUnique').mockReturnValueOnce({
        id: 1,
        name: 'Existing User',
        username: 'userexists',
        role: 'CASHIER',
      })
    }
    const mockRequest = {
      json: async () => request,
    }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
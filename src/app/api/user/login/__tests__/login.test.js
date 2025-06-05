/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { POST } from '~/app/api/user/login/route'


vi.mock('bcrypt', () => {
  return {
    default: {
      compare: (inputPassword, realPassword) => inputPassword === realPassword ? true : false 
    }
  }
})

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: () => 'successful token'
    }
  }
})

vi.mock('~/app/api/Libs/prisma', () => ({
  default: {
    user:{
      findUnique: ({ where }) => ({
        id: 1,
        username: where.username,
        password: 'password',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        active: 'active'
      })
    }
  }
}))


describe('API User Login - POST', () => {
  it.each([
    {
      descr: 'Successful login',
      request: {
        username: 'admin',
        password: 'password'
      },
      expectedStatus: 200,
      expectedResponse: 'successful token'
    },
    {
      descr: 'Error missing username',
      request: {
        password: 'password'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error missing password',
      request: {
        username: 'admin'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error user not found',
      request: {
        username: 'nonexistent',
        password: 'password'
      },
      isEmpty: true,
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error invalid password',
      request: {
        username: 'admin',
        password: 'wrong_password'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error in database operation',
      request: {
        username: 'admin',
        password: 'password'
      },
      mockImplementation: new Error('Database error'),
      expectedStatus: 500,
      expectedResponse: { error: 'Database error' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isEmpty }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'findUnique').mockRejectedValueOnce(mockImplementation)
    }
    if(isEmpty){
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.user, 'findUnique').mockReturnValueOnce(null)
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
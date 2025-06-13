import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/ticket/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      ticket: {
        findMany: () => ([
          { id: 1, total: 100, userId: 1, products: [], createdAt: 'createdAt', updatedAt: 'updatedAt' },
          { id: 2, total: 200, userId: 2, products: [], createdAt: 'createdAt', updatedAt: 'updatedAt' }
        ]),
        create: ({ data }) => ({
          id: 1,
          ...data,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
        }),
      },
      lot: {
        findMany: () => ([
          { id: 1, productId: 1, currentAmount: 10, createdAt: 'createdAt' },
          { id: 2, productId: 1, currentAmount: 5, createdAt: 'createdAt' }
        ]),
        update: ({ where, data }) => ({ ...where, ...data }),
      }
    },
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ userId: 1, role: 'ADMIN' }) }
})

describe('API Ticket - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        { id: 1, total: 100, userId: 1, products: [] },
        { id: 2, total: 200, userId: 2, products: [] }
      ]
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
      descr: 'Error fetching tickets',
      mockImplementation: new Error('DB error'),
      expectedStatus: 500,
      expectedResponse: { error: 'DB error' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.ticket, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ userId: 1, role: 'GUEST' })
    }
    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.ticket, 'findMany').mockReturnValueOnce([])
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Ticket - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        products: [{ productId: 1, quantity: 2 }],
        total: 100
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        products: { create: [{ connect: { productId: 1 }, quantityProduct: 2 }] },
        userId: 1,
        total: 100,
      }
    },
    {
      descr: 'Error creating ticket',
      request: {
        products: [{ productId: 1, quantity: 2 }],
        total: 100
      },
      mockImplementation: new Error('DB error'),
      expectedStatus: 500,
      expectedResponse: { error: 'DB error' }
    },
    {
      descr: 'Error has not permission',
      request: {
        products: [{ productId: 1, quantity: 2 }],
        total: 100
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {},
      isInvalid: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isInvalid }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.ticket, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ userId: 1, role: 'GUEST' })
    }
    if (isInvalid) {
      const validator = await import('~/app/api/Libs/validatorFields')
      vi.spyOn(validator, 'default').mockReturnValueOnce(false)
    }
    const mockRequest = { json: async () => request }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/lot/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      lot: {
        findMany: () => ([
          {
            id: 1,
            productId: 1,
            initialAmount: 100,
            currentAmount: 80,
            expirationDate: '2024-12-31',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          },
          {
            id: 2,
            productId: 2,
            initialAmount: 50,
            currentAmount: 45,
            expirationDate: '2024-10-15',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          }
        ]),
        create: ({ data }) => ({
          id: 3,
          ...data,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          product: {
            id: data.productId,
            name: 'Test Product',
            price: 10.5
          }
        })
      },
      product: {
        findUnique: ({ where }) => where.id === 1 
          ? { id: 1, name: 'Test Product', price: 10.5 } 
          : null
      }
    }
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

vi.mock('~/api/entities', () => ({
  Lots: {
    shape: ['productId', 'initialAmount', 'expirationDate']
  }
}))

describe('API Lot - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          productId: 1,
          initialAmount: 100,
          currentAmount: 80,
          expirationDate: '2024-12-31'
        },
        {
          id: 2,
          productId: 2,
          initialAmount: 50,
          currentAmount: 45,
          expirationDate: '2024-10-15'
        }
      ]
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has warehouse role (should succeed)',
      hasWarehouseRole: true,
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          productId: 1,
          initialAmount: 100,
          currentAmount: 80,
          expirationDate: '2024-12-31'
        },
        {
          id: 2,
          productId: 2,
          initialAmount: 50,
          currentAmount: 45,
          expirationDate: '2024-10-15'
        }
      ]
    },
    {
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error fetching lots',
      mockImplementation: new Error('Error fetching lots'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching lots' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty, hasWarehouseRole }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.lot, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'CASHIER', userId: 1 })
    }
    if (hasWarehouseRole) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'WAREHOUSE', userId: 1 })
    }
    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.lot, 'findMany').mockReturnValueOnce([])
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Lot - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        productId: 1,
        initialAmount: 100,
        expirationDate: '2024-12-31'
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        product: {
          id: 1,
          name: 'Test Product',
          price: 10.5
        },
        productId: 1,
        initialAmount: 100,
        currentAmount: 100,
        expirationDate: '2024-12-31'
      }
    },
    {
      descr: 'Error creating lot',
      request: {
        productId: 1,
        initialAmount: 100,
        expirationDate: '2024-12-31'
      },
      mockImplementation: new Error('Error creating lot'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error creating lot' }
    },
    {
      descr: 'Error has not permission',
      request: {
        productId: 1,
        initialAmount: 100,
        expirationDate: '2024-12-31'
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has warehouse role (should succeed)',
      request: {
        productId: 1,
        initialAmount: 100,
        expirationDate: '2024-12-31'
      },
      hasWarehouseRole: true,
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        productId: 1,
        product: {
          id: 1,
          name: 'Test Product',
          price: 10.5
        },
        initialAmount: 100,
        currentAmount: 100,
        expirationDate: '2024-12-31'
      }
    },
    {
      descr: 'Error invalid input',
      request: {
        productId: 1,
        initialAmount: 100
      },
      isInvalidData: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error product not found',
      request: {
        productId: 999,
        initialAmount: 100,
        expirationDate: '2024-12-31'
      },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isInvalidData, hasWarehouseRole }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.lot, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'CASHIER', userId: 1 })
    }
    if (hasWarehouseRole) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'WAREHOUSE', userId: 1 })
    }
    if (isInvalidData) {
      const validator = await import('~/app/api/Libs/validatorFields')
      vi.spyOn(validator, 'default').mockReturnValueOnce(false)
    }
    if (request && request.productId === 999) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'findUnique').mockReturnValueOnce(null)
    }
    
    const mockRequest = {
      json: async () => request
    }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
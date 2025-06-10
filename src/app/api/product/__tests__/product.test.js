/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/product/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      product: {
        findMany: () => ([
          {
            id: 1,
            name: 'Product 1',
            unit: 'KG',
            price: 10,
            SKU: 'P001',
            active: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          },
          {
            id: 2,
            name: 'Product 2',
            unit: 'PIECE',
            price: 5,
            SKU: 'P002',
            active: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          }
        ]),
        create: ({ data }) => ({
          id: 3,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          ...data,
        }),
      },
    },
  }
})

vi.mock('~/app/api/Libs/auth', () => ({
  authenticateToken: () => ({ role: 'ADMIN', userId: 1 }),
}))

vi.mock('~/app/api/Libs/cleanerData', () => ({
  default: ({ payload }) => ({
    id: payload.id,
    name: payload.name,
    unit: payload.unit,
    price: payload.price,
    SKU: payload.SKU,
  }),
}))

vi.mock('~/app/api/Libs/validatorFields', () => ({
  default: ({ data }) => data.name && data.unit && data.price && data.SKU,
}))

describe('API Product - GET', () => {
  it.each([
    {
      descr: 'Successful fetch of products',
      expectedStatus: 200,
      expectedResponse: [
        { id: 1, name: 'Product 1', unit: 'KG', price: 10, SKU: 'P001' },
        { id: 2, name: 'Product 2', unit: 'PIECE', price: 5, SKU: 'P002' },
      ],
    },
    {
      descr: 'Forbidden access - no user',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Empty list of products',
      isEmpty: true,
      expectedStatus: 200,
      expectedResponse: [],
    },
    {
      descr: 'Error fetching products',
      mockImplementation: new Error('DB error'),
      expectedStatus: 500,
      expectedResponse: { error: 'DB error' },
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, isNotAllowed, isEmpty, mockImplementation }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }

    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'findMany').mockReturnValueOnce([])
    }

    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'findMany').mockRejectedValueOnce(mockImplementation)
    }

    const response = await GET()
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API Product - POST', () => {
  it.each([
    {
      descr: 'Successful product creation',
      request: {
        name: 'Sugar',
        unit: 'KG',
        price: 22,
        SKU: 'SUG001'
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        name: 'Sugar',
        unit: 'KG',
        price: 22,
        SKU: 'SUG001'
      },
    },
    {
      descr: 'Invalid input data',
      request: { name: 'Sugar' },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Forbidden access',
      request: {
        name: 'Sugar',
        unit: 'KG',
        price: 22,
        SKU: 'SUG001'
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Error creating product',
      request: {
        name: 'Sugar',
        unit: 'KG',
        price: 22,
        SKU: 'SUG001'
      },
      mockImplementation: new Error('DB create error'),
      expectedStatus: 500,
      expectedResponse: { error: 'DB create error' },
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, isNotAllowed, mockImplementation }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }

    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'create').mockRejectedValueOnce(mockImplementation)
    }

    const mockRequest = {
      json: async () => request,
    }

    const response = await POST(mockRequest)
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

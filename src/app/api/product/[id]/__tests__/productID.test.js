/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { PUT, PATCH, DELETE } from '~/app/api/product/[id]/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      product: {
        update: ({ where, data }) => ({
          id: where.id,
          ...data,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        }),
        delete: ({ where }) => ({
          id: where.id,
          name: 'Deleted Product',
          unit: 'KG',
          price: 100,
          SKU: 'DEL001',
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
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

describe('API Product [id] - PUT', () => {
  it.each([
    {
      descr: 'Successful update',
      params: { id: '3' },
      request: {
        name: 'Updated Sugar',
        unit: 'KG',
        price: 25,
        SKU: 'SUG002'
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 3,
        name: 'Updated Sugar',
        unit: 'KG',
        price: 25,
        SKU: 'SUG002',
      },
    },
    {
      descr: 'Invalid id param',
      params: { id: 'abc' },
      request: {},
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' },
    },
    {
      descr: 'Forbidden access',
      isNotAllowed: true,
      params: { id: '3' },
      request: {
        name: 'Updated Sugar',
        unit: 'KG',
        price: 25,
        SKU: 'SUG002'
      },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Invalid data',
      params: { id: '3' },
      request: { name: 'Sugar' },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Error during update',
      params: { id: '3' },
      request: {
        name: 'Sugar',
        unit: 'KG',
        price: 25,
        SKU: 'SUG002'
      },
      mockImplementation: new Error('Update failed'),
      expectedStatus: 500,
      expectedResponse: { error: 'Update failed' },
    }
  ])('$descr', async ({ request, params, expectedStatus, expectedResponse, isNotAllowed, mockImplementation }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'update').mockRejectedValueOnce(mockImplementation)
    }
    const mockRequest = {
      json: async () => request,
    }
    const response = await PUT(mockRequest, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API Product [id] - PATCH', () => {
  it.each([
    {
      descr: 'Successful partial update',
      params: { id: '5' },
      request: {
        price: 50,
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 5,
        name: undefined,
        unit: undefined,
        price: 50,
        SKU: undefined,
      },
    },
    {
      descr: 'Forbidden access',
      params: { id: '5' },
      request: { price: 50 },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Invalid id',
      params: { id: 'bad' },
      request: {},
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' },
    },
    {
      descr: 'Error during patch',
      params: { id: '5' },
      request: { price: 50 },
      mockImplementation: new Error('Patch failed'),
      expectedStatus: 500,
      expectedResponse: { error: 'Patch failed' },
    }
  ])('$descr', async ({ request, params, expectedStatus, expectedResponse, isNotAllowed, mockImplementation }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'update').mockRejectedValueOnce(mockImplementation)
    }
    const mockRequest = {
      json: async () => request,
    }
    const response = await PATCH(mockRequest, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API Product [id] - DELETE', () => {
  it.each([
    {
      descr: 'Successful delete',
      params: { id: '8' },
      expectedStatus: 200,
      expectedResponse: {
        id: 8,
        name: 'Deleted Product',
        unit: 'KG',
        price: 100,
        SKU: 'DEL001',
      },
    },
    {
      descr: 'Forbidden access',
      isNotAllowed: true,
      params: { id: '8' },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
    },
    {
      descr: 'Invalid id',
      params: { id: 'x' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' },
    },
    {
      descr: 'Error deleting product',
      params: { id: '8' },
      mockImplementation: new Error('Delete failed'),
      expectedStatus: 500,
      expectedResponse: { error: 'Delete failed' },
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, params, isNotAllowed, mockImplementation }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'delete').mockRejectedValueOnce(mockImplementation)
    }

    const response = await DELETE({}, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

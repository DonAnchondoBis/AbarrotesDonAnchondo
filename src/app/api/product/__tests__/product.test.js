/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/product/route'

// Mock de prisma
vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      product: {
        findMany: () => ([
          {
            id: 1,
            name: 'Rice',
            unit: 'KG',
            price: 20.5,
            SKU: 'RICE001',
            imageUrl: 'https://example.com/rice.jpg',
            active: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          },
          {
            id: 2,
            name: 'Sugar',
            unit: 'KG',
            price: 15.75,
            SKU: 'SUG001',
            imageUrl: 'https://example.com/sugar.jpg',
            active: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          }
        ]),
        create: ({ data }) => ({
          id: 3,
          ...data,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        }),
      },
    },
  }
})

// Mock de auth
vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

// Mock de validatorFields
vi.mock('~/app/api/Libs/validatorFields', () => {
  return {
    default: ({ data, shape }) => {
      // Por defecto, consideramos válidos los datos
      return shape.every(field => data[field] !== undefined)
    }
  }
})

// Mock de cleanerData
vi.mock('~/app/api/Libs/cleanerData', () => {
  return {
    default: ({ payload }) => {
      const { createdAt, updatedAt, ...rest } = payload
      return rest
    }
  }
})


// Mock de fetch para cloudinary
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({ url: 'https://example.com/uploaded.jpg' })
  })
)

// Mock de FormData
global.FormData = class {
  constructor() {
    this.data = {}
  }
  append(key, value) {
    this.data[key] = value
  }
  get(key) {
    return this.data[key]
  }
}

describe('API Product - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          name: 'Rice',
          unit: 'KG',
          price: 20.5,
          SKU: 'RICE001',
          imageUrl: 'https://example.com/rice.jpg',
          active: true,
        },
        {
          id: 2,
          name: 'Sugar',
          unit: 'KG',
          price: 15.75,
          SKU: 'SUG001',
          imageUrl: 'https://example.com/sugar.jpg',
          active: true,
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
      descr: 'Error fetching products',
      mockImplementation: new Error('Error fetching products'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching products' }
    },
    {
      descr: 'Error has cashier role (should succeed)',
      hasCashierRole: true,
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          name: 'Rice',
          unit: 'KG',
          price: 20.5,
          SKU: 'RICE001',
          imageUrl: 'https://example.com/rice.jpg',
          active: true,
        },
        {
          id: 2,
          name: 'Sugar',
          unit: 'KG',
          price: 15.75,
          SKU: 'SUG001',
          imageUrl: 'https://example.com/sugar.jpg',
          active: true,
        }
      ]
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, hasCashierRole }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (hasCashierRole) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'CASHIER', userId: 1 })
    }

    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Product - POST', () => {
  it.each([
    {
      descr: 'Successful product creation',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        name: 'New Product',
        unit: 'KG',
        price: 25,
        SKU: 'NEW001',
        imageUrl: 'https://example.com/uploaded.jpg',
      }
    },
    {
      descr: 'Error uploading image',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      failedUpload: true,
      expectedStatus: 503,
      expectedResponse: { error: 'Service unavailable' }
    },
    {
      descr: 'Error creating product',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      mockImplementation: new Error('Error creating product'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error creating product' }
    },
    {
      descr: 'Error has not permission',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error missing file',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: null
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error has warehouse role (should succeed)',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          unit: 'KG',
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      hasWarehouseRole: true,
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        name: 'New Product',
        unit: 'KG',
        price: 25,
        SKU: 'NEW001',
        imageUrl: 'https://example.com/uploaded.jpg'
      }
    },
    {
      descr: 'Error invalid data',
      request: {
        data: JSON.stringify({
          name: 'New Product',
          // Falta unit
          price: 25,
          SKU: 'NEW001'
        }),
        file: new Blob(['dummy'], { type: 'image/png' })
      },
      invalidData: true,
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, hasWarehouseRole, invalidData, failedUpload }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.product, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (hasWarehouseRole) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'WAREHOUSE', userId: 1 })
    }
    if (invalidData) {
      const validator = await import('~/app/api/Libs/validatorFields')
      vi.spyOn(validator, 'default').mockReturnValueOnce(false)
    }
    if (failedUpload) {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ url: null })
        })
      )
    }
    
    const formData = new FormData()
    formData.append('data', request.data)
    if (request.file) {
      formData.append('file', request.file)
    }
    
    const mockRequest = {
      formData: async () => formData
    }
    
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
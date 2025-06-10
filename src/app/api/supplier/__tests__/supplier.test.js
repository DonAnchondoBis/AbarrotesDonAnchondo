/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/supplier/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      supplier: {
        findMany: () => ([
          {
            id: 1,
            name: 'Proveedor 1',
            contact: 'Juan Pérez',
            phone: '6141234567',
            email: 'proveedor1@example.com',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          },
          {
            id: 2,
            name: 'Proveedor 2',
            contact: 'María López',
            phone: '6147654321',
            email: 'proveedor2@example.com',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          }
        ]),
        create: ({ data }) => ({
          id: 1,
          ...data,
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

vi.mock('~/api/entities', () => ({
  Supplier: {
    shape: ['name', 'contact', 'phone', 'email']
  }
}))

describe('API Supplier - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          name: 'Proveedor 1',
          contact: 'Juan Pérez',
          phone: '6141234567',
          email: 'proveedor1@example.com',
        },
        {
          id: 2,
          name: 'Proveedor 2',
          contact: 'María López',
          phone: '6147654321',
          email: 'proveedor2@example.com',
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
      descr: 'Error has not data',
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error fetching suppliers',
      mockImplementation: new Error('Error fetching suppliers'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching suppliers' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.supplier, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.supplier, 'findMany').mockReturnValueOnce([])
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Supplier - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'Nuevo Proveedor',
        contact: 'Carlos Rodríguez',
        phone: '6144567890',
        email: 'nuevo@example.com'
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 1,
        name: 'Nuevo Proveedor',
        contact: 'Carlos Rodríguez',
        phone: '6144567890',
        email: 'nuevo@example.com'
      }
    },
    {
      descr: 'Error creating supplier',
      request: {
        name: 'Nuevo Proveedor',
        contact: 'Carlos Rodríguez',
        phone: '6144567890',
        email: 'nuevo@example.com'
      },
      mockImplementation: new Error('Error creating supplier'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error creating supplier' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'Nuevo Proveedor',
        contact: 'Carlos Rodríguez',
        phone: '6144567890',
        email: 'nuevo@example.com'
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has not admin role',
      request: {
        name: 'Nuevo Proveedor',
        contact: 'Carlos Rodríguez',
        phone: '6144567890',
        email: 'nuevo@example.com'
      },
      hasInvalidRole: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        name: 'Nuevo Proveedor',
        phone: '6144567890'
      },
      isInvalidData: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, hasInvalidRole, isInvalidData }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.supplier, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (hasInvalidRole) {
      const authenticateToken = await import('~/app/api/Libs/auth')
      vi.spyOn(authenticateToken, 'authenticateToken').mockReturnValueOnce({ role: 'CASHIER', userId: 1 })
    }
    if (isInvalidData) {
      const validator = await import('~/app/api/Libs/validatorFields')
      vi.spyOn(validator, 'default').mockReturnValueOnce(false)
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
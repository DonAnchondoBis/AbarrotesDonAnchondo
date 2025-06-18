/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/inventoryLog/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      inventoryLog: {
        findMany: vi.fn(() => ([
          {
            id: 1,
            productName: 'Arroz',
            amount: 10,
            description: 'Ingreso inicial',
            expirationDate: '2025-12-31',
            type: 'INCOME',
            user: {
              name: 'Admin'
            },
            createdAt: new Date('2023-06-15T12:00:00Z'),
            updatedAt: 'updatedAt'
          },
          {
            id: 2,
            productName: 'Frijol',
            amount: 5,
            description: 'Retiro por daños',
            expirationDate: '2025-10-15',
            type: 'DECREASE',
            user: {
              name: 'Warehouse'
            },
            createdAt: new Date('2023-06-15T12:00:00Z'),
            updatedAt: 'updatedAt'
          }
        ])),
        create: vi.fn(({ data }) => ({
          id: 3,
          ...data,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
        }))
      },
      lot: {
        findFirst: vi.fn(({ where }) => 
          where.product.name === 'Arroz' && where.expirationDate === '2025-12-31'
            ? { id: 1, currentAmount: 20 } 
            : null
        ),
        update: vi.fn(() => ({ id: 1, currentAmount: 30 }))
      }
    }
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

vi.mock('~/app/api/Libs/validatorFields', () => {
  return {
    default: ({ data }) => {
      // Validar que los campos requeridos estén presentes
      const requiredFields = ['productName', 'amount', 'description', 'expirationDate', 'type', 'userId']
      return requiredFields.every(field => data && data[field] !== undefined)
    }
  }
})

describe('API InventoryLog - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse: [
        {
          id: 1,
          productName: 'Arroz',
          amount: 10,
          description: 'Ingreso inicial',
          expirationDate: '2025-12-31',
          type: 'INCOME',
          user: 'Admin',
          date: '2023-06-15'
        },
        {
          id: 2,
          productName: 'Frijol',
          amount: 5,
          description: 'Retiro por daños',
          expirationDate: '2025-10-15',
          type: 'DECREASE',
          user: 'Warehouse',
          date: '2023-06-15'
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
      descr: 'Error fetching inventory logs',
      mockImplementation: new Error('Error fetching inventory logs'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching inventory logs' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isEmpty }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.inventoryLog, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if (isEmpty) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.inventoryLog, 'findMany').mockReturnValueOnce([])
    }

    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API InventoryLog - POST', () => {
  it.each([
    {
      descr: 'Successful inventory increase',
      request: {
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      }
    },
    {
      descr: 'Successful inventory income',
      request: {
        productName: 'Arroz',
        amount: 10,
        description: 'Ingreso inicial',
        expirationDate: '2025-12-31',
        type: 'INCOME',
        userId: 1
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        productName: 'Arroz',
        amount: 10,
        description: 'Ingreso inicial',
        expirationDate: '2025-12-31',
        type: 'INCOME',
        userId: 1
      }
    },
    {
      descr: 'Successful inventory decrease',
      request: {
        productName: 'Arroz',
        amount: 5,
        description: 'Retiro',
        expirationDate: '2025-12-31',
        type: 'DECREASE',
        userId: 1
      },
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        productName: 'Arroz',
        amount: 5,
        description: 'Retiro',
        expirationDate: '2025-12-31',
        type: 'DECREASE',
        userId: 1
      }
    },
    {
      descr: 'Error not found product',
      request: {
        productName: 'ProductoInexistente',
        amount: 5,
        description: 'Producto que no existe',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error negative amount after operation',
      request: {
        productName: 'Arroz',
        amount: 30,
        description: 'Cantidad excede existencia',
        expirationDate: '2025-12-31',
        type: 'DECREASE',
        userId: 1
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error has not permission',
      request: {
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has warehouse role (should succeed)',
      request: {
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      },
      warehouseRole: true,
      expectedStatus: 201,
      expectedResponse: {
        id: 3,
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      }
    },
    {
      descr: 'Error invalid input data',
      request: {
        productName: 'Arroz',
        description: 'Falta campo amount',
        expirationDate: '2025-12-31',
        type: 'INCREASE'
      },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error in database operation',
      request: {
        productName: 'Arroz',
        amount: 10,
        description: 'Nuevo ingreso',
        expirationDate: '2025-12-31',
        type: 'INCREASE',
        userId: 1
      },
      mockImplementation: new Error('Database error'),
      expectedStatus: 500,
      expectedResponse: { error: 'Database error' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed, warehouseRole }) => {
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.lot, 'findFirst').mockRejectedValueOnce(mockImplementation)
    }
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    if (warehouseRole) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce({ role: 'WAREHOUSE', userId: 1 })
    }

    // Mock calculación de nuevo amount basado en el tipo
    if (request && request.productName === 'Arroz' && request.type === 'DECREASE' && request.amount > 20) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.lot, 'findFirst').mockReturnValueOnce({ id: 1, currentAmount: 20 })
    }

    const mockRequest = {
      json: async () => request,
      nextUrl: { searchParams: new URLSearchParams() }
    }
    const response = await POST(mockRequest)
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})
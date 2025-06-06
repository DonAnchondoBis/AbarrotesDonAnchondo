/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/inventoryLog/route'

vi.mock('~/app/api/Libs/prisma', () => ({
  default: {
    lot: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    inventoryLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock('~/app/api/Libs/auth', () => ({
  authenticateToken: vi.fn().mockReturnValue(1),
}))

vi.mock('~/app/api/Libs/cleanerData', () => ({
  default: ({ payload }) => payload,
}))

vi.mock('~/app/api/Libs/validatorFields', () => ({
  default: ({ data, shape }) => !!data && !!shape,
}))

describe('Inventory API - POST', () => {
  it('should create inventory log and update lot successfully', async () => {
    const prisma = await import('~/app/api/Libs/prisma')

    prisma.default.lot.findFirst.mockResolvedValue({
      id: 1,
      currentAmount: 10,
    })

    prisma.default.lot.update.mockResolvedValue({ id: 1, currentAmount: 15 })

    prisma.default.inventoryLog.create.mockResolvedValue({
      id: 123,
      productName: 'Test Product',
      amount: 5,
      type: 'INCREASE',
    })

    const mockRequest = {
      json: async () => ({
        productName: 'Test Product',
        expirationDate: '2025-12-31',
        amount: 5,
        type: 'INCREASE',
      }),
    }

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.id).toBe(123)
  })

  it('should return 404 if target lot not found', async () => {
    const prisma = await import('~/app/api/Libs/prisma')
    prisma.default.lot.findFirst.mockResolvedValue(null)

    const mockRequest = {
      json: async () => ({
        productName: 'Missing Product',
        expirationDate: '2025-12-31',
        amount: 5,
        type: 'INCREASE',
      }),
    }

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should return 403 if not authenticated', async () => {
    const auth = await import('~/app/api/Libs/auth')
    auth.authenticateToken.mockReturnValueOnce(null)

    const mockRequest = {
      json: async () => ({
        productName: 'Unauthorized Product',
        expirationDate: '2025-12-31',
        amount: 5,
        type: 'INCREASE',
      }),
    }

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(403)
    expect(json.error).toBeDefined()
  })

  it('should return 400 if amount goes below zero', async () => {
    const prisma = await import('~/app/api/Libs/prisma')
    prisma.default.lot.findFirst.mockResolvedValue({
      id: 1,
      currentAmount: 3,
    })

    const mockRequest = {
      json: async () => ({
        productName: 'Negative Product',
        expirationDate: '2025-12-31',
        amount: 5,
        type: 'OUTCOME',
      }),
    }

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})

describe('Inventory API - GET', () => {
  it('should return inventory logs successfully', async () => {
    const prisma = await import('~/app/api/Libs/prisma')
    prisma.default.inventoryLog.findMany.mockResolvedValue([
      {
        id: 1,
        productName: 'Prod 1',
        amount: 10,
        description: 'desc',
        expirationDate: '2025-12-31',
        type: 'INCOME',
        user: { name: 'User1' },
      },
    ])

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    }

    const response = await GET(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.length).toBe(1)
    expect(json[0].productName).toBe('Prod 1')
  })

  it('should return 404 if no logs found', async () => {
    const prisma = await import('~/app/api/Libs/prisma')
    prisma.default.inventoryLog.findMany.mockResolvedValue([])

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    }

    const response = await GET(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })
})

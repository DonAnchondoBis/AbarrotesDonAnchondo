/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/storeInfo/[id]/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      storeInfo: {
        findUnique: vi.fn(({ where }) =>
          where.id === 1
            ? {
              id: 1,
              name: 'Abarrotes Don Anchondo',
              address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
              phone: '+52 614 123 4567',
              dollarValue: 17.25,
              yenValue: 0.12,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt'
            }
            : null
        ),
        update: vi.fn(({ where, data }) =>
          where.id === 1
            ? {
              id: 1,
              ...data,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt'
            }
            : null
        ),
        delete: vi.fn(({ where }) =>
          where.id === 1
            ? {
              id: 1,
              name: 'Abarrotes Don Anchondo',
              address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
              phone: '+52 614 123 4567',
              dollarValue: 17.25,
              yenValue: 0.12,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt'
            }
            : null
        ),
      }
    }
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => (1) }
})

describe('API StoreInfo [id] - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ params, expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    const request = {}
    const response = await GET(request, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API StoreInfo [id] - PUT', () => {
  it.each([
    {
      descr: 'Successful update',
      params: { id: 1 },
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12
      },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: {
        name: 'Abarrotes Don Anchondo'
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ params, request: reqBody, expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    const request = { json: async () => reqBody }
    const response = await PUT(request, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API StoreInfo [id] - PATCH', () => {
  it.each([
    {
      descr: 'Successful patch',
      params: { id: 1 },
      request: { name: 'Nuevo Nombre' },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Nuevo Nombre',
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: { name: 'Nuevo Nombre' },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: { name: 'Nuevo Nombre' },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: { name: 'Nuevo Nombre' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ params, request: reqBody, expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    const request = { json: async () => reqBody }
    const response = await PATCH(request, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})

describe('API StoreInfo [id] - DELETE', () => {
  it.each([
    {
      descr: 'Successful delete',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ params, expectedStatus, expectedResponse, isNotAllowed }) => {
    if (isNotAllowed) {
      const auth = await import('~/app/api/Libs/auth')
      vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
    }
    const request = {}
    const response = await DELETE(request, { params })
    const json = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(json).toEqual(expectedResponse)
  })
})
/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET } from '~/app/api/ticket/[id]/route'


vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      ticket: {
        findUnique: vi.fn(({ where }) =>
          where.id === 1 
            ? {
              id: 1,
              products: [
                {
                  id: 1,
                  name: 'Product 1',
                  price: 10.0,
                  quantity: 2
                },
                {
                  id: 2,
                  name: 'Product 2',
                  price: 20.0,
                  quantity: 1
                },
                {
                  id: 3,
                  name: 'Product 3',
                  price: 30.0,
                  quantity: 4
                }
              ],
              total: 160.0,
              userid: 1,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt'
            }
            : null
        )
      }
    }
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

describe('API Ticket [id] - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: 
        {
          id: 1,
          products: [
            { id: 1, name: 'Product 1', price: 10.0, quantity: 2 },
            { id: 2, name: 'Product 2', price: 20.0, quantity: 1 },
            { id: 3, name: 'Product 3', price: 30.0, quantity: 4 }
          ],
          total: 160.0,
          userid: 1
        }
    },
    {
      descr: 'Error has not permission',
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error has not data',
      params: { id: 999 }, // <--- Asegúrate de pasar un id numérico inexistente
      isEmpty: true,
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error fetching ticket',
      params: { id: 1 },
      mockImplementation: new Error('DB error'),
      expectedStatus: 500,
      expectedResponse: { error: 'DB error' }
    },
    {
      descr: 'Invalid id param (not a number)',
      params: { id: 'abc' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Missing id param',
      params: {},
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'User is not ADMIN (role USER)',
      mockAuth: { role: 'USER', userId: 2 },
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    }
  ])('$descr',
    async ({ params, expectedStatus, expectedResponse, isNotAllowed, isEmpty, mockImplementation, mockAuth }) => {
      if (mockImplementation) {
        const prisma = (await import('~/app/api/Libs/prisma')).default
        vi.spyOn(prisma.ticket, 'findUnique').mockImplementation(() => { throw mockImplementation })
      } else if (isEmpty) {
        const prisma = (await import('~/app/api/Libs/prisma')).default
        vi.spyOn(prisma.ticket, 'findUnique').mockImplementation(() => null)
      }
      if (isNotAllowed) {
        const auth = await import('~/app/api/Libs/auth')
        vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(null)
      }
      if (mockAuth) {
        const auth = await import('~/app/api/Libs/auth')
        vi.spyOn(auth, 'authenticateToken').mockReturnValueOnce(mockAuth)
      }
      const request = {}
      const response = await GET(request, { params })
      const json = await response.json()
      expect(response.status).toBe (expectedStatus)
      expect(json).toEqual(expectedResponse)
    }
  )
})

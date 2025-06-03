/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '~/app/api/storeInfo/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      storeInfo: {
        findMany: () => ([
          {
            id: 1,
            name: 'store info 1',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          },
          {
            id : 2,
            name: 'store info 2',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
          }
        ]),
        create: ({ data }) => ({
          id: 1,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
          ...data,
        }),
      },
    },
  }
})

vi.mock('~/app/api/Libs/auth', () => {
  return { authenticateToken: () => (1) }
})


describe('API Club - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      expectedStatus: 200,
      expectedResponse:[
        {
          id: 1,
          name: 'store info 1',
        },
        {
          id: 2,
          name: 'store info 2',
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
      descr: 'Error fetching clubs',
      mockImplementation:  new Error('Error fetching clubs'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching clubs' }
    }
  ])('$descr', async ({ expectedStatus, expectedResponse, mockImplementation, isNotAllowed, isEmpty }) =>{
    if(mockImplementation){
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.storeInfo, 'findMany').mockRejectedValueOnce(mockImplementation)
    }
    if(isNotAllowed){
      const authenticateToken = await import ('~/app/api/Libs/auth')
      vi.spyOn( authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
    }
    if(isEmpty){
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.storeInfo, 'findMany').mockReturnValueOnce([])
    }
    const response = await GET()
    const jsonResponse = await response.json()
    expect(response.status).toBe(expectedStatus)
    expect(jsonResponse).toEqual(expectedResponse)
  })
})

describe('API Club - POST', () => {
  it.each([
    {
      descr: 'Successful response',
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      },
      expectedStatus: 201,
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
      descr: 'Error creating store info',
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      },
      mockImplementation:  new Error('Error fetching packages'),
      expectedStatus: 500,
      expectedResponse: { error: 'Error fetching packages' }
    },
    {
      descr: 'Error has not permission',
      request: {
        name: 'Abarrotes Don Anchondo',
        address: 'Av. Revolución 123, Col. Centro, Chihuahua, CHIH',
        phone: '+52 614 123 4567',
        dollarValue: 17.25,
        yenValue: 0.12,
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error invalid input',
      request: {
        name: 'store info 1',
      },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    }
  ])('$descr', async ({ request, expectedStatus, expectedResponse, mockImplementation, isNotAllowed }) =>{
    if (mockImplementation) {
      const prisma = await import('~/app/api/Libs/prisma')
      vi.spyOn(prisma.default.storeInfo, 'create').mockRejectedValueOnce(mockImplementation)
    }
    if(isNotAllowed){
      const authenticateToken = await import ('~/app/api/Libs/auth')
      vi.spyOn( authenticateToken, 'authenticateToken').mockReturnValueOnce(null)
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
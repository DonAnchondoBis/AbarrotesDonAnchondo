/* eslint-disable babel/new-cap */
import { describe, it, expect, vi } from 'vitest'
import { GET, PUT, PATCH, DELETE } from '~/app/api/user/[id]/route'

vi.mock('~/app/api/Libs/prisma', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(({ where }) =>
          where.id === 1
            ? {
              id: 1,
              name: 'John Doe',
              username: 'johndoe',
              password: 'hashedpassword123',
              role: 'ADMIN',
              active: true,
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
              name: 'John Doe',
              username: 'johndoe',
              password: 'hashedpassword123',
              role: 'ADMIN',
              active: true,
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
  return { authenticateToken: () => ({ role: 'ADMIN', userId: 1 }) }
})

describe('API User [id] - GET', () => {
  it.each([
    {
      descr: 'Successful response',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        role: 'ADMIN',
        active: true
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

describe('API User [id] - PUT', () => {
  it.each([
    {
      descr: 'Successful update',
      params: { id: 1 },
      request: {
        name: 'Jane Doe',
        username: 'janedoe',
        role: 'ADMIN',
        active: true
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Jane Doe',
        username: 'janedoe',
        role: 'ADMIN',
        active: true
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: {
        name: 'Jane Doe',
        username: 'janedoe',
        role: 'ADMIN',
        active: true
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: {
        name: 'Jane Doe',
        username: 'janedoe',
        role: 'ADMIN',
        active: true
      },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: {
        name: 'Jane Doe'
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

describe('API User [id] - PATCH', () => {
  it.each([
    {
      descr: 'Successful patch',
      params: { id: 1 },
      request: { name: 'Updated Name' },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Updated Name'
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: { name: 'Updated Name' },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: { name: 'Updated Name' },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: { name: 'Updated Name' },
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

describe('API User [id] - DELETE', () => {
  it.each([
    {
      descr: 'Successful delete',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        role: 'ADMIN',
        active: true
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
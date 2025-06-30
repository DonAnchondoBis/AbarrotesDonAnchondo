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
              name: 'Admin User',
              username: 'admin',
              role: 'ADMIN',
              createdAt: 'createdAt',
              updatedAt: 'updatedAt'
            }
            : null
        ),
        update: vi.fn(({ where, data }) => {
          if (where.id === 1) {
            if (data && data.active === false) {
              return {
                id: 1,
                name: 'Admin User',
                username: 'admin',
                role: 'ADMIN',
                active: false,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
              }
            }
            return {
              id: 1,
              ...data,
              createdAt: 'createdAt',
              updatedAt: 'updatedAt',
            }
          }
          return null
        }),
      },
    },
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
        name: 'Admin User',
        username: 'admin',
        role: 'ADMIN'
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
        name: 'Updated User',
        username: 'updated',
        password: 'newpassword',
        role: 'ADMIN'
      },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Updated User',
        username: 'updated',
        role: 'ADMIN'
      }
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: {
        name: 'Updated User',
        username: 'updated',
        password: 'newpassword',
        role: 'ADMIN'
      },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: {
        name: 'Updated User',
        username: 'updated',
        password: 'newpassword',
        role: 'ADMIN'
      },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: {
        name: 'Updated User'
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
      request: { name: 'Patched Name' },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Patched Name'
      }
    },
    {
      descr: 'Successful patch with password',
      params: { id: 1 },
      request: { password: 'newpass123' },
      expectedStatus: 200,
      expectedResponse: {
        id: 1
      },
      testPassword: true
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      request: { name: 'Patched Name' },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' }
    },
    {
      descr: 'Error not found',
      params: { id: 999 },
      request: { name: 'Patched Name' },
      expectedStatus: 404,
      expectedResponse: { error: 'Not found' }
    },
    {
      descr: 'Error invalid id',
      params: { id: 'abc' },
      request: { name: 'Patched Name' },
      expectedStatus: 400,
      expectedResponse: { error: 'Invalid fields' }
    },
    {
      descr: 'Error no data provided',
      params: { id: 1 },
      request: null,
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
      descr: 'Successful soft delete',
      params: { id: 1 },
      expectedStatus: 200,
      expectedResponse: {
        id: 1,
        name: 'Admin User',
        username: 'admin',
        role: 'ADMIN',
        active: false,
      },
    },
    {
      descr: 'Error has not permission',
      params: { id: 1 },
      isNotAllowed: true,
      expectedStatus: 403,
      expectedResponse: { error: 'Not allowed' },
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
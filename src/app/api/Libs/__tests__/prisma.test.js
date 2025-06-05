import { describe, it, expect, vi } from 'vitest'

vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    storeInfo: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }

  return {
    PrismaClient: vi.fn(() => mockPrismaClient)
  }
})

import prisma from '../prisma'

describe('prisma client', () => {
  it.each([
    { descr: 'should be defined', method: prisma, expected: true },
    { descr: 'should have $connect method', method: prisma.$connect, expected: 'function' },
    { descr: 'should have $disconnect method', method: prisma.$disconnect, expected: 'function' },
    { descr: 'should have storeInfo client', method: prisma.storeInfo, expected: true },
    { descr: 'should have product client', method: prisma.product, expected: true },
    { descr: 'should have user client', method: prisma.user, expected: true }
  ])('$descr', ({ method, expected }) => {
    if (expected === 'function') {
      expect(typeof method).toBe(expected)
    } else {
      expect(!!method).toBe(expected)
    }
  })

  it.each([
    { descr: 'storeInfo.findMany', model: 'storeInfo', method: 'findMany' },
    { descr: 'storeInfo.findUnique', model: 'storeInfo', method: 'findUnique' },
    { descr: 'storeInfo.create', model: 'storeInfo', method: 'create' },
    { descr: 'storeInfo.update', model: 'storeInfo', method: 'update' },
    { descr: 'storeInfo.delete', model: 'storeInfo', method: 'delete' },
    { descr: 'product.findMany', model: 'product', method: 'findMany' },
    { descr: 'product.findUnique', model: 'product', method: 'findUnique' },
    { descr: 'product.create', model: 'product', method: 'create' },
    { descr: 'product.update', model: 'product', method: 'update' },
    { descr: 'product.delete', model: 'product', method: 'delete' },
    { descr: 'user.findMany', model: 'user', method: 'findMany' },
    { descr: 'user.findUnique', model: 'user', method: 'findUnique' },
    { descr: 'user.create', model: 'user', method: 'create' },
    { descr: 'user.update', model: 'user', method: 'update' },
    { descr: 'user.delete', model: 'user', method: 'delete' }
  ])('should have $method for $model model', ({ model, method }) => {
    expect(typeof prisma[model][method]).toBe('function')
  })
})
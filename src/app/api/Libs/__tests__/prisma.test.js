import { describe, it, expect, vi } from 'vitest'

vi.mock('~/app/api/Libs/prisma', () => ({
  default: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  }
}))

import prisma from '~/app/api/Libs/prisma'

describe('prisma libs', () => {
  it('should be defined', () => {
    expect(prisma).toBeDefined()
  })

  it('should have a $connect method', () => {
    expect(typeof prisma.$connect).toBe('function')
  })

  it('should have a $disconnect method', () => {
    expect(typeof prisma.$disconnect).toBe('function')
  })
})
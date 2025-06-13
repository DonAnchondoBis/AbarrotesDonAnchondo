import { describe, it, expect } from 'vitest'
import cleanerData from '~/app/api/Libs/cleanerData'

describe('cleanerData libs', () => {
  it.each([
    {
      descr: 'Empty data',
      payload: {},
      result: {}
    },
    {
      descr: 'Has complete payload and does not filt password',
      payload: {
        entity: 'Entity',
        password: 'password',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
      result: {
        entity: 'Entity',
      }
    },
    {
      descr: 'Has complete payload and does not filt password',
      payload: {
        entity: 'Entity',
        password: 'password',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        key1: 'key1',
        key2: 'key2',
      },
      omitProps: ['key1', 'key2'],
      result: {
        entity: 'Entity',
      }
    },
  ])('$descr', ({ payload, result, omitProps }) =>{
    expect(cleanerData({ payload, omitProps })).toEqual(result)
  })
})
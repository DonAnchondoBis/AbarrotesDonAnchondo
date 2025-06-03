import { describe, it, expect } from 'vitest'
import payloadFormatter from '~/app/api/Libs/Utils/payloadFormatter'

describe('payloadFormatter utils', () => {
  it.each([
    {
      descr: 'Empty data',
      arr: [],
      result: {}
    },
    {
      descr: 'Single data',
      arr: [{ id: 1, name: 'Jonh' }],
      result: { 1: { id: 1, name: 'Jonh' } }
    },
    {
      descr: 'Multiple data',
      arr: [{ id: 1, name: 'Jonh' }, { id: 2, name: 'Jane' }],
      result: { 1: { id: 1, name: 'Jonh' }, 2: { id: 2, name: 'Jane' } }
    }

  ])('$descr', ({ arr, result }) => {
    expect(payloadFormatter(arr)).toEqual(result)
  })
})
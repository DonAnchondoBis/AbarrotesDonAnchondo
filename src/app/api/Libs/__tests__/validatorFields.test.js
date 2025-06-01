import { describe, it, expect } from 'vitest'
import validatorFields from '~/app/api/Libs/validatorFields'

describe('validatorFields libs', () => {
  it.each([
    {
      descr: 'Valid data with all required fields',
      data: { name: 'Store', address: 'Address', phone: '123', dollarValue: 1, yenValue: 2 },
      shape: ['name', 'address', 'phone', 'dollarValue', 'yenValue'],
      result: true
    },
    {
      descr: 'Missing one required field',
      data: { name: 'Store', address: 'Address', phone: '123', dollarValue: 1 },
      shape: ['name', 'address', 'phone', 'dollarValue', 'yenValue'],
      throws: true
    },
    {
      descr: 'Empty data and non-empty shape',
      data: {},
      shape: ['name'],
      throws: true
    },
    {
      descr: 'Empty shape (should always be valid)',
      data: { any: 'value' },
      shape: [],
      result: true
    }
  ])('$descr', ({ data, shape, result, throws }) => {
    if (throws) {
      expect(() => validatorFields({ data, shape })).toThrow('Invalid fields')
    } else {
      expect(validatorFields({ data, shape })).toEqual(result)
    }
  })
})
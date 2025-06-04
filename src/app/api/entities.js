export const StoreInfo = {
  name: 'storeInfo',
  shape: [
    'name',
    'address',
    'phone',
    'dollarValue',
    'yenValue',
  ]
}

export const User = {
  name: 'user',
  shape: {
    name: 'string',
    username: 'string',
    password: 'string',
    role: 'string',
    active: 'boolean'
  }
}



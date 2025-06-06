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

export const Ticket = {
  name: 'tickets',
  shape: [
    'products',
    'total'
  ]
}

export const User = {
  name: 'user',
  shape: [
    'name',
    'username',
    'password',
    'role'
  ]
}

export const InventoryLog = {
  name: 'inventoryLog',
  shape: [
    'productName',
    'amount',
    'description',
    'expirationDate',
    'type',
    'userId'
  ]
}

export const Supplier = {
  name: 'supplier',
  shape: [
    'name',
    'phone',
    'email'
  ]
}

export const Lots = {
  name: 'lots',
  shape: [
    'productId',
    'initialAmount',
    'expirationDate'
  ]
}

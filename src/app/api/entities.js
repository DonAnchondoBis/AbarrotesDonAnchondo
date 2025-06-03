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

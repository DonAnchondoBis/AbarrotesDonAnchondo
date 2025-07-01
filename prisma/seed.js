import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
async function main() {

  await prisma.ticketProduct.deleteMany({})
  await prisma.ticket.deleteMany({})
  await prisma.inventoryLog.deleteMany({})
  await prisma.lot.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.storeInfo.deleteMany({})
  await prisma.supplier.deleteMany({})
  await prisma.user.deleteMany({})

  //Users
  await Promise.all([
    prisma.user.upsert({
      where: { username: 'arturo' },
      update: {},
      create: {
        name: 'Arthuro',
        username: 'arturo',
        password: await bcrypt.hash('a', 12),
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { username: 'wendys' },
      update: {},
      create: {
        name: 'Wendys',
        username: 'wendys',
        password: await bcrypt.hash('w', 12),
        role: 'WAREHOUSE',
      },
    }),
    prisma.user.upsert({
      where: { username: 'carlos' },
      update: {},
      create: {
        name: 'Carlos',
        username: 'carlos',
        password: await bcrypt.hash('c', 12),
        role: 'CASHIER',
      },
    }), 
  ])
  
  //Products
  const product = await Promise.all([
    prisma.product.upsert({
      where: { name: "Apple's" },
      update: {},
      create: {
        name: "Apple's",
        unit: 'PIECE',
        price: 50,
        SKU: 'app',
        imageUrl: 'http://res.cloudinary.com/dhpnfud6f/image/upload/v1751387304/apple_krw5pg.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Milk' },
      update: {},
      create: {
        name: 'Milk',
        unit: 'PIECE',
        price: 25,
        SKU: 'mil',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751388626/milk_rhadyz.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Bread' },
      update: {},
      create: {
        name: 'Bread',
        unit: 'PIECE',
        price: 50,
        SKU: 'bre',
        imageUrl: 'http://res.cloudinary.com/dhpnfud6f/image/upload/v1751387484/bread_fznudt.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Avocado' },
      update: {},
      create: {
        name: 'Avocado',
        unit: 'KG',
        price: 20,
        SKU: 'aguas',
        imageUrl: 'http://res.cloudinary.com/dhpnfud6f/image/upload/v1751387568/avocado_nv2pmd.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Eggs' },
      update: {},
      create: {
        name: 'Eggs',
        unit: 'KG',
        price: 98,
        SKU: 'egg',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389101/egg_tzxli5.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Cheese' },
      update: {},
      create: {
        name: 'Cheese',
        unit: 'KG',
        price: 20,
        SKU: 'chee',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389104/cheese_p6c9yr.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Soda' },
      update: {},
      create: {
        name: 'Soda',
        unit: 'PIECE',
        price: 20,
        SKU: 'so',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389104/soda_aw7njr.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Chocolate' },
      update: {},
      create: {
        name: 'Chocolate',
        unit: 'PIECE',
        price: 20,
        SKU: 'choco',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389104/chocolate_bvb880.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Pepper' },
      update: {},
      create: {
        name: 'Pepper',
        unit: 'PIECE',
        price: 20,
        SKU: 'pep',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389860/pepper_jblbiz.png',
      },
    }),
    prisma.product.upsert({
      where: { name: 'Potato' },
      update: {},
      create: {
        name: 'Potato',
        unit: 'KG',
        price: 20,
        SKU: 'pota',
        imageUrl: 'https://res.cloudinary.com/dhpnfud6f/image/upload/v1751389974/potato_irz56q.png',
      },
    }),
  ])

  //Lots
  await Promise.all([
    product.map(p=>
      prisma.lot.create({
        data: {
          productId: p.id,
          initialAmount: 100,
          currentAmount: 100,
          expirationDate: '2026-12-31',
        },
      })
    )
  ])
    
  //Suppliers
  await prisma.supplier.upsert({
    where: { name: 'Potato' },
    update: {},
    create: [
      {
        name: 'Nestlé México',
        phone: '800-123-4567',
        email: 'ventas@nestle.com.mx',
      },
      {
        name: 'Grupo Bimbo',
        phone: '800-123-0001',
        email: 'proveedores@bimbo.com',
      },
      {
        name: 'La Moderna',
        phone: '800-456-7890',
        email: 'pedidos@lamoderna.com',
      },
      {
        name: 'Sigma Alimentos',
        phone: '800-321-4321',
        email: 'contacto@sigmaalimentos.com',
      },
      {
        name: 'Lala México',
        phone: '800-000-5252',
        email: 'contacto@lala.com.mx',
      },
      {
        name: 'Gamesa',
        phone: '800-555-2233',
        email: 'proveedor@gamesa.com.mx',
      },
      {
        name: 'Herdez',
        phone: '800-456-9999',
        email: 'ventas@herdez.com.mx',
      },
    ],
  })

  //Store
  await prisma.storeInfo.create({
    data: {
      name: 'Abarrotes Don Anchondo',
      address: 'Av. Rancho la Casita 123, Col. San Cienega de Ortiz',
      phone: '55-1234-5650',
      dollarValue: 18.5,
      yenValue: 0.13,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
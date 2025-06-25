import { NextResponse } from 'next/server'
import { Ticket } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

//Post method for a ticket
export const POST = async request => {
  try {
    const { userId, role } = authenticateToken(request)
    const data = await request.json()
    const isValid = validatorFields({ data, shape: Ticket.shape })

    if (userId && isValid && (role == 'ADMIN' || role == 'CASHIER')){
      for (const product of data.products) {
        const lots = await prisma.lot.findMany({
          where: {
            productId: product.productId,
            currentAmount: { gt: 0 }
          }
        })
        const totalAvailable = lots.reduce((sum, lot) => sum + lot.currentAmount, 0)
        if (totalAvailable < product.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for product ID ${product.productId}` },
            { status: 400 }
          )
        }
      }

      const payload = await prisma.ticket.create({
        data: {
          products: {
            create: data.products.map(product => ({
              product: { connect: { id: product.productId } },
              quantityProduct: product.quantity
            }))
          },
          userId,
          total: data.total,
        }
      })
      // Lots update and delete operation to sell
      await Promise.all(data.products.map(async product => {
        let saleAmount = product.quantity
        const lots = await prisma.lot.findMany({
          where: {
            productId: product.productId,
            currentAmount: {
              gt: 0
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        })
        lots.forEach (async lot => {
          if (saleAmount <= 0) return
          if (lot.currentAmount > saleAmount) {
            await prisma.lot.update({
              where: { id: lot.id },
              data: { currentAmount: lot.currentAmount - saleAmount }
            })
            saleAmount = 0
            return
          }
          if (lot.currentAmount <= saleAmount) {
            saleAmount -= lot.currentAmount
            await prisma.lot.update({
              where: { id: lot.id },
              data: { currentAmount: 0 }
            })
          }
        })
      }))
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 201 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

// Get method for tickets
export const GET = async request => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    const validRoles = ['ADMIN', 'CASHIER']
    if (!userId || !validRoles.includes(role)) return ERROR.FORBIDDEN()
    const filter = Object.fromEntries(request?.nextUrl?.searchParams ?? '')
    const payloads = await prisma.ticket.findMany({
      select: {
        id: true,
        total: true,
        createdAt: true,
        userId: true,
        products: {
          include: {
            product: true
          },
        },
      },
      where: {
        ...(filter)
      }
    })
    if (payloads.length > 0) {
      const processedPayloads = payloads.map(payload => {
        const year = payload.createdAt.getFullYear()
        const month = String(payload.createdAt.getMonth() + 1).padStart(2, '0')
        const day = String(payload.createdAt.getDate()).padStart(2, '0')
        return {
          ...payload,
          date: `${year}-${month}-${day}`,
        }
      })
      const response = processedPayloads.map(payload => cleanerData({ payload }))
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
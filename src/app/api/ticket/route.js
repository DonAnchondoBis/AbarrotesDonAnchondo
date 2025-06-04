// TODO: Add authentication logic
import { NextResponse } from 'next/server'
import { Ticket } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

//Post method for a ticket
export const POST = async request => {
  try{
    const { userId, role } = authenticateToken(request)
    const data = await request.json()
    const isValid = validatorFields({ data, shape: Ticket.shape })

    if(userId && isValid && (role == 'ADMIN' || role == 'CASHIER')){
      const payload = await prisma.ticket.create({
        data: {
          products: {
            create: data.products.map(product => ({
              connect: { productId: product.productId },
              quantityProduct: product.quantity
            }))
          },
          userId,
          total: data.total,
        }
      })
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
  try{
    const { role } = authenticateToken(request)
    if(role != 'ADMIN' && role != 'CASHIER') return ERROR.FORBIDDEN()
    const filter = Object.fromEntries(request?.nextUrl?.searchParams ?? '')
    const payloads = await prisma.ticket.findMany({
      where: {
        ...(filter)
      }
    })
    if(payloads.length > 0){
      const response = payloads.map(payload => cleanerData({ payload }))
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
// TODO: Add authentication logic
import { NextResponse } from 'next/server'
import { Ticket } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import { EMPTY_OBJECT } from '~/app/Lib/Utils/constants'
import prisma from '~/app/api/Libs/prisma'

export const POST = async request => {
  try{
    const hasPermission = authenticateToken(request)
    const data = await request.json()
    const isValid = validatorFields({ data, shape: Ticket.shape })

    if(hasPermission && isValid){
      const payload = await prisma.ticket.create({
        data: {
          products: {
            create: data.products.map(product => ({
              connect: { productId: product.productId },
              quantityProduct: product.quantity
            }))
          },
          ...data
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
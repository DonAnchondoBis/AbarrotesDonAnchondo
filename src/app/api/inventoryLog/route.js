// TODO: Add authentication logic
import { NextResponse } from 'next/server'
import { InventoryLog } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

export const POST = async request => {
  try {
    const { role , userId } = authenticateToken(request) ?? {}
    const data = await request.json()
    const isValid = validatorFields({ data, shape: InventoryLog.shape })
    const validRoles = ['ADMIN', 'WAREHOUSE']
    if (userId && validRoles.includes(role) && isValid){
      //The transaction is executed first, if it fails, it will not create the inventory log
      const target = await prisma.lot.findFirst({
        select:{
          id:true,
          currentAmount: true
        },
        where:{
          product:{
            name: data.productName
          },
          expirationDate: data.expirationDate
        }
      })
      if (!target) return ERROR.NOT_FOUND()
        
      // Check if the new amount is less than 0
      const newAmount = (data.type== 'INCREASE' || data.type=='INCOME')?(target.currentAmount+data.amount):(target.currentAmount-data.amount)

      if (newAmount<0) return ERROR.INVALID_FIELDS()

      //The change is done in the lot first, if it fails, it will not create the inventory log
      await prisma.lot.update({
        where: {
          id: target.id
        },
        data: {
          currentAmount: newAmount
        }
      })
        
      //If the action is succesful, the inventory log is created
      const payload = await prisma.inventoryLog.create({
        data
      })
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 201 })


    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const GET = async request => {
  try {
    const { role , userId } = authenticateToken(request) ?? {}
    const validRoles = ['ADMIN', 'WAREHOUSE']
    if (!userId || !validRoles.includes(role)) return ERROR.FORBIDDEN()
    const filter = Object.fromEntries(request?.nextUrl?.searchParams ?? '')
    const payloads = await prisma.inventoryLog.findMany({
      select: {
        id: true,
        productName: true,
        amount: true,
        description: true,
        expirationDate: true,
        type: true,
        user:{
          select:{
            name:true
          }
        }
      },
      where: {
        ...(filter)
      }
    })
    if (payloads.length > 0){
      const processedPayloads = payloads.map(payload => {
        return {
          ...payload,
          user: payload.user.name
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
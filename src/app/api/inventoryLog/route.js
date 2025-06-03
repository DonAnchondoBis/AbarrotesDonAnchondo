// TODO: Add authentication logic
import { NextResponse } from 'next/server'
import { InventoryLog } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

export const POST = async request => {
  try{
    const hasPermission = true //authenticateToken(request)
    const data = await request.json()
    const isValid = validatorFields({ data, shape: InventoryLog.shape })
    if(hasPermission && isValid){
        //The transaction is executed first, if it fails, it will not create the inventory log
        const action = await prisma.lot

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
    try{
        const hasPermission = true //authenticateToken(request)
        if(!hasPermission) return ERROR.FORBIDDEN()
        const filter = Object.fromEntries(request?.nextUrl?.searchParams ?? '')
    console.log('filter', filter)
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
        if(payloads.length > 0){
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
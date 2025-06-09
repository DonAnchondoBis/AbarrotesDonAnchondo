import { NextResponse } from 'next/server'
import { Product } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

export const PUT = async (request, { params }) => {
  try {
    const { role = null } = authenticateToken(request) ?? {}
    
    if (!['ADMIN', 'WAREHOUSE'].includes(role)) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const data = await request.json()
    const isValid = validatorFields({ data, shape: Product.shape })
    if (isValid){
      const payload = await prisma.product.update({
        where: {
          id: Number(id),
        },
        data
      })
      if (!payload) return ERROR.NOT_FOUND()
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.FORBIDDEN()
  } catch (error) {
    console.error('Error in PUT /api/product/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async (request, { params }) => {
  try {
    const { role = null } = authenticateToken(request) ?? {}
    if (!['ADMIN', 'WAREHOUSE'].includes(role)) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const data = await request.json()
    const payload = await prisma.product.update({
      where: { id: Number(id) },
      data
    })

    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error in PATCH /api/product/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { role = null } = authenticateToken(request) ?? {}
    if (!['ADMIN', 'WAREHOUSE'].includes(role)) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const payload = await prisma.product.delete({
      where: { 
        id: Number(id) 
      }
    })

    if (payload) {
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    console.error('Error in DELETE /api/product/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
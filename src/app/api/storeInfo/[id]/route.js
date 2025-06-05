import { NextResponse } from 'next/server'
import { StoreInfo } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'

export const GET = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if (role !== 'ADMIN' || !userId) return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const payload = await prisma.storeInfo.findUnique({
      where: {
        id: Number(id),
      }
    })
    if (payload){
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if (role !== 'ADMIN' || !userId) return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const data = await request.json()
    const isValid = validatorFields({ data, shape: StoreInfo.shape })
    if (isValid) {
      const payload = await prisma.storeInfo.update({
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
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PATCH = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if (role !== 'ADMIN' || !userId) return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const data = await request.json()
    const payload = await prisma.storeInfo.update({
      where: {
        id: Number(id),
      },
      data
    })
    if (payload) {
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if (role !== 'ADMIN' || !userId) return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const payload = await prisma.storeInfo.delete({
      where: {
        id: Number(id),
      }
    })
    if (payload) {
      const response = cleanerData({ payload })
      return NextResponse.json(response, { status: 200 })
    }
    return ERROR.NOT_FOUND()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
import { NextResponse } from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import { authenticateToken } from '~/app/api/Libs/auth'
import bcrypt from 'bcryptjs'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import { User } from '~/api/entities'
import { EMPTY_OBJECT } from '~/app/Lib/Utils/constants'

export const GET = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const payload = await prisma.user.findUnique({ where: { id: Number(id) } })
    if (!payload) return ERROR.NOT_FOUND()

    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const PUT = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const data = await request.json()
    const isValid = validatorFields({ data, shape: User.shape })
    if (isValid) {
      const payload = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          ...data,
          ...(data?.password ? { password: await bcrypt.hash(data.password, 12) } : EMPTY_OBJECT)
        }
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
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const data = await request.json()
    if (!data) return ERROR.INVALID_FIELDS()

    const payload = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...data,
        ...(data?.password ? { password: await bcrypt.hash(data.password, 12) } : EMPTY_OBJECT)
      }
    })

    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const DELETE = async (request, { params }) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()

    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()

    const payload = await prisma.user.delete({
      where: { id: Number(id) }
    })

    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
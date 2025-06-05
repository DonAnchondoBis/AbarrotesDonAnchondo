import { NextResponse } from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import { User } from '~/api/entities'
import validatorFields from '~/app/api/Libs/validatorFields'
import cleanerData from '~/app/api/Libs/cleanerData'
import bcrypt from 'bcrypt'
import ERROR from '~/Libs/error'
import { authenticateToken } from '~/app/api/Libs/auth'

export const POST = async request => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()

    const data = await request.json()
    const isValid = validatorFields({ data, shape: User.shape })
    if (!isValid) return ERROR.INVALID_FIELDS()

    const existingUser = await prisma.user.findUnique({ where: { username: data.username } })
    if (existingUser) return ERROR.USER_ALREADY_EXISTS()

    const payload = await prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 12)
      }
    })
    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const GET = async request => {
  try {
    const { role, userId } = authenticateToken(request) ?? {}
    if(role !== 'ADMIN' && !userId) return ERROR.FORBIDDEN()

    const payloads = await prisma.user.findMany()
    if (payloads.length === 0) return ERROR.NOT_FOUND()
    const response = payloads.map(payload => cleanerData({ payload }))
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
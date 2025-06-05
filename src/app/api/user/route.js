import { NextResponse } from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import { User } from '~/api/entities'
import validatorFields from '~/app/api/Libs/validatorFields'
import cleanerData from '~/app/api/Libs/cleanerData'
import bcrypt from 'bcryptjs'
import ERROR from '~/Libs/error'
import { authenticateToken } from '~/app/api/Libs/auth'

export const POST = async request => {
  try {
    const auth = authenticateToken(request)
    if (!auth || auth.role !== 'ADMIN') return ERROR.FORBIDDEN()

    const data = await request.json()
    // Change this line to match what your validator expects
    const isValid = validatorFields({ data, shape: User.shape })
    if (!isValid) return ERROR.INVALID_FIELDS()

    const existingUser = await prisma.user.findUnique({ where: { username: data.username } })
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    const userData = {
      name: data.name || data.username, // Default to username if name not provided
      active: data.active !== undefined ? data.active : true, // Default to true
      ...data
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const payload = await prisma.user.create({
      data: { ...userData, password: hashedPassword }
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
    const auth = authenticateToken(request)
    if (!auth || auth.role !== 'ADMIN') return ERROR.FORBIDDEN()

    const users = await prisma.user.findMany()
    const response = users.map(u => cleanerData({ payload: u }))
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

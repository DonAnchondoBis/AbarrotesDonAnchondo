import { NextResponse } from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ERROR from '~/Libs/error'

export const POST = async request => {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return ERROR.INVALID_FIELDS()

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return ERROR.INVALID_FIELDS()

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return ERROR.INVALID_FIELDS()

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET)

    return NextResponse.json(token, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
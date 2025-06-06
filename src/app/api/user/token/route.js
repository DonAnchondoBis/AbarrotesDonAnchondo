import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import ERROR from '~/Libs/error'

export const POST = async request => {
  try {
    const { token } = await request.json()
    if (!token) return ERROR.INVALID_FIELDS()

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return NextResponse.json({ valid: true, decoded }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: error.status || 401 })
  }
}
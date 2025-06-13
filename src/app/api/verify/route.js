import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/Libs/auth'

import ERROR from '~/Libs/error'
export const GET = async request => {
  try {
    const { userId, role } = authenticateToken(request)
    if (!userId || !role) return ERROR.FORBIDDEN()
    return NextResponse.json({ userId, role }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 401 })
  }
}
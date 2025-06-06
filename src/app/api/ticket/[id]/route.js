import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import prisma from '~/app/api/Libs/prisma'

export const GET = async (request, { params }) => {
  try {
    const { role } = authenticateToken(request) ?? {}
    if (role !== 'ADMIN') return ERROR.FORBIDDEN()
    const { id } = params
    if (!Number(id)) return ERROR.INVALID_FIELDS()
    const payload = await prisma.ticket.findUnique({
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

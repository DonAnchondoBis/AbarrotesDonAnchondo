import {NextResponse} from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import {authenticateToken} from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'

export const GET = async (request, {params}) => {
    try {
        const hasPermission = authenticateToken(request)
        if (!hasPermission) return ERROR.FORBIDDEN()
        const {id} = params
        if (!Number(id)) return ERROR.INVALID_FIELDS()

        const user = await prisma.user.findUnique({where: {id: Number(id)}})
        if (!user) return ERROR.NOT_FOUND()

        const response = cleanerData({payload: user})
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export const PATCH = async (request, {params}) => {
    try {
        const hasPermission = authenticateToken(request)
        if (!hasPermission) return ERROR.FORBIDDEN()

        const {id} = params
        if (!Number(id)) return ERROR.INVALID_FIELDS()

        const data = await request.json()
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }

        const updated = await prisma.user.update({
            where: {id: Number(id)},
            data
        })

        const response = cleanerData({payload: updated})
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export const DELETE = async (request, {params}) => {
    try {
        const hasPermission = authenticateToken(request)
        if (!hasPermission) return ERROR.FORBIDDEN()
        const {id} = params
        if (!Number(id)) return ERROR.INVALID_FIELDS()

        const deleted = await prisma.user.delete({
            where: {id: Number(id)}
        })

        const response = cleanerData({payload: deleted})
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

import {NextResponse} from 'next/server'
import prisma from '~/app/api/Libs/prisma'
import {User} from '~/api/entities'
import validatorFields from '~/app/api/Libs/validatorFields'
import cleanerData from '~/app/api/Libs/cleanerData'
import bcrypt from 'bcryptjs'
import ERROR from '~/Libs/error'
import {authenticateToken} from '~/app/api/Libs/auth'

export const POST = async request => {
    try {
        const data = await request.json()
        const isValid = validatorFields({data, shape: Object.keys(User.shape)})
        if (!isValid) return ERROR.INVALID_FIELDS()

        const existingUser = await prisma.user.findUnique({where: {username: data.username}})
        if (existingUser) return NextResponse.json({error: 'Username already exists'}, {status: 409})

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const payload = await prisma.user.create({
            data: {...data, password: hashedPassword}
        })

        const response = cleanerData({payload})
        return NextResponse.json(response, {status: 201})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export const GET = async request => {
    try {
        const hasPermission = authenticateToken(request)
        if (!hasPermission) return ERROR.FORBIDDEN()

        const users = await prisma.user.findMany()
        const response = users.map(u => cleanerData({payload: u}))
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

import { NextResponse } from 'next/server'
import { Product } from '~/api/entities'
import { authenticateToken } from '~/app/api/Libs/auth'
import ERROR from '~/Libs/error'
import cleanerData from '~/app/api/Libs/cleanerData'
import validatorFields from '~/app/api/Libs/validatorFields'
import prisma from '~/app/api/Libs/prisma'
const CLOUDINARY_URL = process.env.CLOUDINARY_URL

export const GET = async request => {
  try {
    const { role = null, userId } = authenticateToken(request) ?? {}

    if (!['ADMIN', 'WAREHOUSE', 'CASHIER'].includes(role) || !userId) return ERROR.FORBIDDEN()

    const products = await prisma.product.findMany({
      where: { active: true }
    })
    const response = products.map(product => cleanerData({ payload: product }))
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/product:', error)
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}

export const POST = async request => {
  try {
    const { role = null, userId } = authenticateToken(request) ?? {}
    if (!['ADMIN', 'WAREHOUSE'].includes(role) || !userId) return ERROR.FORBIDDEN()

    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) return ERROR.INVALID_FIELDS()

    const data = JSON.parse(formData.get('data'))

    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('upload_preset', 'unsignedV')
    uploadForm.append('cloud_name', 'dhpnfud6f')

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: uploadForm
    })  
    const uploadResult = await res.json()
    if (!uploadResult.url) return ERROR.SERVICE_UNAVAILABLE()

    // Add image URL to data
    data.image = uploadResult.url

    // Validate after image is present
    const isValid = validatorFields({ data, shape: Product.shape })
    if (!isValid) return ERROR.INVALID_FIELDS()

    const payload = await prisma.product.create({
      data
    })
    const response = cleanerData({ payload })
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/product:', error)
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
}
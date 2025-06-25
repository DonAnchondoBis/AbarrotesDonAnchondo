import * as Yup from 'yup'

export const getAddProductValidationSchema = () => Yup.object({
  name: Yup.string().required('Product name is required'),
  SKU: Yup.string().required('SKU is required'),
  unit: Yup.string().required('Unit of measure is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be 0 or greater'),
  image: Yup.mixed()
    .nullable()
    .test(
      'fileFormat',
      'Unsupported file format. Please use JPEG, PNG, or WebP images.',
      value => {
        if (!value) return true
        return ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(value.type)
      }
    )
    .test(
      'fileSize',
      'The image is too large. Maximum size is 5MB.',
      value => {
        if (!value) return true
        return value.size <= 5 * 1024 * 1024
      }
    )
})

export const getAddProductInitialValues = () => ({
  name: '',
  SKU: '',
  unit: '',
  price: '',
  image: null
})

export const getAdjustmentValidationSchema = () =>
  Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .min(0, 'Amount must be 0 or greater'),
    description: Yup.string().required('Description is required'),
    expirationDate: Yup.date().required('Expiration date is required'),
    type: Yup.string().required('Type is required'),
  })

export const getAdjustmentInitialValues = ({ productName, userId }) => ({
  productName: productName || '',
  amount: '',
  description: '',
  expirationDate: '',
  type: '',
  userId: userId || '',
})

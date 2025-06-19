import * as Yup from 'yup'

export const getAddLotValidationSchema = () => Yup.object({
  productId: Yup.string().required('Product is required'),
  initialAmount: Yup.number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number'),
  expirationDate: Yup.date()
    .required('Expiration date is required')
    .min(new Date(), 'Expiration date must be later than today')
})

export const getAddLotInitialValues = () => ({
  productId: '',
  initialAmount: '',
  expirationDate: ''
})

export const getAddSupplierValidationSchema = () => Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
})

export const getAddSupplierInitialValues = () => ({
  name: '',
  email: '',
  phone: '',
})
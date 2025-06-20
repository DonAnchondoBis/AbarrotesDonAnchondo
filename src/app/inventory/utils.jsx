import * as Yup from 'yup'

export const getAddProductValidationSchema = () => Yup.object({
  name: Yup.string().required('Product name is required'),
  sku: Yup.string().required('SKU is required'),
  unit: Yup.string().required('Unit of measure is required'),
  stock: Yup.number()
    .required('Stock is required')
    .min(0, 'Stock must be 0 or greater')
    .integer('Stock must be a whole number'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be 0 or greater')
})

export const getAddProductInitialValues = () => ({
  name: '',
  sku: '',
  unit: '',
  stock: '',
  price: ''
})

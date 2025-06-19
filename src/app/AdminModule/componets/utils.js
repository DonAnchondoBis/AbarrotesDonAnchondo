import * as Yup from 'yup'

export const getAddUserValidationSchema = () => Yup.object({
  name: Yup.string().required('Nombre requerido'),
  username: Yup.string().required('Username requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Password requerido'),
  role: Yup.string().oneOf(['ADMIN', 'CASHIER', 'WAREHOUSE']).required('Rol requerido'),
})

export const getEditUserValidationSchema = () => Yup.object({
  name: Yup.string().required('Field required'),
  username: Yup.string().required('Field required'),
  role: Yup.string().oneOf(['ADMIN', 'CASHIER', 'WAREHOUSE']).required('Field required'),
  password: Yup.string().min(6, 'Minimum 6 characters').optional(),
})
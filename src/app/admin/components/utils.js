import * as Yup from 'yup'

export const getAddUserValidationSchema = () => Yup.object({
  name: Yup.string().required('Name is Required'),
  username: Yup.string().required('Username is Required'),

  password: Yup.string().min(6, 'Minimum 6 characters"').required('Password required'),
  role: Yup.string().oneOf(['ADMIN', 'CASHIER', 'WAREHOUSE']).required('Role required'),
})

export const getEditUserValidationSchema = () => Yup.object({
  name: Yup.string().required('Field is required'),
  username: Yup.string().required('Field is equired'),
  role: Yup.string().oneOf(['ADMIN', 'CASHIER', 'WAREHOUSE']).required('Field required'),
  password: Yup.string().min(6, 'Minimum 6 characters').optional(),
})

export const getEditStorageValidationSchema = () => Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone number is required'),
  dollarValue: Yup.number().required('Dollar value is required').positive('Must be positive'),
  yenValue: Yup.number().required('Yen value is required').positive('Must be positive'),
})
import * as Yup from 'yup'

export const getUserLoginValidationSchema = () => Yup.object({
  username: Yup.string()
    .required('Field required'),
  password: Yup.string()
    .required('Field requiered'),
})
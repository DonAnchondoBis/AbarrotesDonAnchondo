'use client'
import {
  Button,
  IconButton,
  Typography as T,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { Formik, Form, Field, useFormikContext } from 'formik'
import getClassPrefixer from '~/app/UI/classPrefixer'
import TextField from '~/app/UI/Shared/FormikTextField'
import SelectField from '~/app/UI/Shared/FormikSelect'
import { getAddSupplierValidationSchema, getAddSupplierInitialValues } from '~/app/purchasing/utils'
import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'

const displayName = 'ModalAddLots'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  width: '100vw',
}))

const ModalAddLots = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      AQUI VA LA OTRA MODAL
    </Container>
  )
}

const Wrapper = ({ onClose, setSnackbarMessage }) => {
  const handleSubmit = async values => console.log(values)

  const validationSchema = getAddSupplierValidationSchema()
  const initialValues = getAddSupplierInitialValues()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <ModalAddLots
        onClose={onClose}
      />
    </Formik>
  )
}

export default Wrapper
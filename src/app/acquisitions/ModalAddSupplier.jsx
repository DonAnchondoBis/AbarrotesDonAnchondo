'use client'
import {
  Button,
  IconButton,
  Typography as T,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import getClassPrefixer from '~/app/UI/classPrefixer'

import { Formik, Form, Field, useFormikContext } from 'formik'
import { getAddSupplierValidationSchema, getAddSupplierInitialValues } from '~/app/acquisitions/utils'
import TextField from '~/app/UI/Shared/FormikTextField'

import { useToken } from '~/app/store/useToken'
import apiFetch from '~/app/Lib/apiFetch'
import Loading from '~/app/UI/Shared/Loading'

import { useState } from 'react'


const displayName = 'ModalAddSuppliers'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  width: '100vw',
  [`& .${classes.modalContainer}`]: {
    width: '40vw',
    '@media (max-width: 768px)': {
      width: '90vw',
    },
    border: `solid 3px ${theme.palette.primary.main}`,
    background: theme.palette.background.main,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '1rem',
    padding: '2rem',
    flexDirection: 'column',
  },
  [`& .${classes.header}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  [`& .${classes.inputs}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%',
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
}))

const ModalAddSuppliers = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            New Supplier
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 3 }} />
        <Form>
          <div className={classes.inputs}>
            <Field
              name="name"
              label="Name"
              variant="outlined"
              type="text"
              component={TextField}
            />
            <Field
              name="email"
              label="Email"
              variant="outlined"
              type="email"
              component={TextField}
            />
            <Field
              name="phone"
              label="Phone"
              variant="outlined"
              type="number"
              component={TextField}
            />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              type="submit"
              disabled={!isValid || !dirty}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  )
}

const Wrapper = ({ onClose,setSnackbarMessage, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()

  const handleSubmit = async values => {
    setIsLoading(true)
    const response = await apiFetch({ url: '/api/supplier', method: 'POST', payload: values, token })
    if (response.error) {
      setSnackbarMessage({ message: 'Error adding the Supplier', severity: 'error' })
    } else {
      setSnackbarMessage({ message: 'Supplier added successfully', severity: 'success' })
      fetchData()
      onClose()
    }
    setIsLoading(false)
  }

  const validationSchema = getAddSupplierValidationSchema()
  const initialValues = getAddSupplierInitialValues()

  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <ModalAddSuppliers
        onClose={onClose}
      />
    </Formik>
  )
}

export default Wrapper
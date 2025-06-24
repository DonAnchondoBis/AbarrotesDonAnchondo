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
import { getAddLotValidationSchema, getAddLotInitialValues } from '~/app/acquisitions/utils'
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
    marginBottom: '1rem'
  },
  [`& .${classes.productRow}`]: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    marginBottom: '1.5rem',
    width: '100%',
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  },
}))

const ModalAddLots = ({ onClose, products = [] }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            New Lot
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 3 }} />
        <Form>
          <div className={classes.productRow}>
            <Field
              name="productId"
              label="Select product"
              variant="outlined"
              component={SelectField}
              options={products?.map(product => ({ value: product.id, label: product.name }))}
            />
            <Field
              name="initialAmount"
              label="Quantity"
              variant="outlined"
              type="number"
              component={TextField}
            />
          </div>
          <Field
            name="expirationDate"
            label="Expiration date"
            variant="outlined"
            type="date"
            component={TextField}
            InputLabelProps={{ shrink: true }}
          />
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

const Wrapper = ({ onClose, products, setSnackbarMessage, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()
  const handleSubmit = async values => {
    setIsLoading(true)
    const response = await apiFetch({ url: '/api/lot', method: 'POST', payload: values, token })
    if (response.error) {
      setSnackbarMessage({ message: 'Error adding the lot', severity: 'error' })
    } else {
      setSnackbarMessage({ message: 'Lot added successfully', severity: 'success' })
      fetchData()
      onClose()
    }
    setIsLoading(false)
  }

  const validationSchema = getAddLotValidationSchema()
  const initialValues = getAddLotInitialValues()

  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <ModalAddLots
        onClose={onClose}
        products={products}
      />
    </Formik>
  )
}

export default Wrapper
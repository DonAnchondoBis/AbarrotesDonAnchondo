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
import { getAddProductValidationSchema } from '~/app/inventory/utils'
import { useToken } from '~/app/store/useToken'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'
import { UnitOptions } from '~/Libs/enums'
import apiFetch from '~/app/Lib/apiFetch'

const displayName = 'ModalEditLots'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  overflow: 'auto',
  [`& .${classes.modalContainer}`]: {
    width: '40vw',
    '@media (max-width: 768px)': {
      width: '90vw',
    },
    overflowY: 'auto',
    maxHeight: '90vh',
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
  [`& .${classes.inputs}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%',
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  },
}))

const EditProductModal = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            New Product
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
              label="Product name"
              variant="outlined"
              type="text"
              component={TextField}
            />
            <Field
              name="SKU"
              label="SKU"
              variant="outlined"
              type="text"
              component={TextField}
            />
            <Field
              name="unit"
              label="Unit"
              variant="outlined"
              type="text"
              component={SelectField}
              options={UnitOptions}
            />
            <Field
              name="price"
              label="Price"
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

const Wrapper = ({ onClose, selectedProduct, setSnackbarMessage, refresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()
  const handleSubmit = async payload => {
    setIsLoading(true)
    const response = await apiFetch({
      url: `/api/product/${selectedProduct?.id }`,
      method: 'PATCH',
      payload: {
        ...payload,
        price: Number(payload.price ?? 0),
      },
      token,
    })
    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({ message: 'Error editing the product', severity: 'error' })
    } else {
      refresh()
      setSnackbarMessage({ message: 'Product edited successfully', severity: 'success' })
      onClose()
    }
  }

  const validationSchema = getAddProductValidationSchema()
  const initialValues = {
    name: selectedProduct?.name || '',
    SKU: selectedProduct?.SKU || '',
    unit: selectedProduct?.unit || '',
    price: selectedProduct?.price || '',
  }

  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <EditProductModal
        onClose={onClose}
        selectedProduct={selectedProduct}
      />
    </Formik>
  )
}

export default Wrapper
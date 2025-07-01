'use client'

import {
  Button,
  IconButton,
  Typography as T,
  Divider,
  InputAdornment,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import getClassPrefixer from '~/app/UI/classPrefixer'
import TextField from '~/app/UI/Shared/FormikTextField'
import { useFormikContext, Formik, Form, Field } from 'formik'
import { useToken } from '~/app/store/useToken'
import apiFetch from '~/app/Lib/apiFetch'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'
import { getEditStorageValidationSchema } from './utils'

const displayName = 'EditDataModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  justifyContent: 'center',
  alignItems: 'center',
  [`& .${classes.modalContainer}`]: {
    width: '30vw',
    '@media (max-width: 768px)': {
      width: '90vw',
    },
    border: `solid 3px ${theme.palette.primary.main}`,
    background: theme.palette.background.main,
    borderRadius: '1rem',
    padding: '2rem',
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
    marginTop: '2rem'
  },
  [`& .${classes.currencyGroup}`]: {
    display: 'flex',
    gap: '1rem'
  },
  [`& .${classes.buttonGroup}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
    gap: '1rem'
  },
}))

const EditForm = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Edit Store Information
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 2 }} />
        <Form>
          <div className={classes.inputs}>
            <Field
              component={TextField}
              variant="outlined"
              label="Name"
              name="name"
              margin="normal"
              fullWidth
            />
            <Field
              component={TextField}
              variant="outlined"
              label="Address"
              name="address"
              margin="normal"
              fullWidth
            />
            <Field
              component={TextField}
              variant="outlined"
              label="Phone Number"
              name="phone"
              margin="normal"
              fullWidth
            />
            <div className={classes.currencyGroup}>
              <Field
                component={TextField}
                variant="outlined"
                label="Dollar Rate"
                name="dollarValue"
                type="number"
                margin="normal"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <Field
                component={TextField}
                variant="outlined"
                label="Yen Rate"
                name="yenValue"
                type="number"
                margin="normal"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className={classes.buttonGroup}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
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

const Wrapper = ({ onClose, data, setSnackbarMessage, refresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()

  const handleSubmit = async values => {
    setIsLoading(true)
    const payload = {
      ...values,
      dollarValue: Number(values.dollarValue),
      yenValue: Number(values.yenValue),
    }

    const response = await apiFetch({
      url: `/api/storeInfo/${data?.id}`,
      method: 'PUT',
      payload,
      token,
    })

    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({
        message: 'Error editing the store info',
        severity: 'error'
      })
    } else {
      setSnackbarMessage({
        message: 'Storage information updated successfully',
        severity: 'success'
      })
      await refresh()
    }
    onClose()
    setIsLoading(false)

  }

  const validationSchema = getEditStorageValidationSchema()
  const initialValues = {
    name: data?.name || '',
    address: data?.address || '',
    phone: data?.phone || '',
    dollarValue: data?.dollarValue || 0,
    yenValue: data?.yenValue || 0,
  }

  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <EditForm onClose={onClose} />
    </Formik>
  )
}

export default Wrapper
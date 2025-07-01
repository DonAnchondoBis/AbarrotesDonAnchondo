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
import { getAdjustmentValidationSchema, getAdjustmentInitialValues } from '~/app/inventory/utils'
import { useToken } from '~/app/store/useToken'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'
import { InventoryLogTypeOptions } from '~/Libs/enums'
import apiFetch from '~/app/Lib/apiFetch'
import { useData } from '~/app/store/useData'

const displayName = 'AdjustmentModal'
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

const AdjustmentModal = ({ onClose, selectedProduct }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Adjustments
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 3 }} />
        <Form>
          <div className={classes.inputs}>
            <Field
              name="type"
              label="Adjustment type"
              variant="outlined"
              type="text"
              component={SelectField}
              options={InventoryLogTypeOptions}
            />
            <Field
              name="expirationDate"
              label="Lot´s expiration Date"
              variant="outlined"
              type="text"
              component={SelectField}
              options={selectedProduct?.lots.map(lot => ({
                label: lot.expirationDate,
                value: lot.expirationDate
              }))}
            />
            <Field
              name="description"
              label="Description"
              variant="outlined"
              type="text"
              component={TextField}
            />
            <Field
              name="amount"
              label="Amount"
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
  const { userId } = useData()

  const handleSubmit = async payload => {
    setIsLoading(true)
    const response = await apiFetch({
      url: '/api/inventoryLog',
      method: 'POST',
      payload: {
        ...payload,
        amount: Number(payload.amount),
      },
      token,
    })
    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({ message: 'Error adding the Adjustment', severity: 'error' })
    } else {
      refresh()
      setSnackbarMessage({ message: 'Adjustment added successfully', severity: 'success' })
      onClose()
    }
  }

  const validationSchema = getAdjustmentValidationSchema()
  const initialValues = getAdjustmentInitialValues({ productName: selectedProduct?.name, userId })

  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <AdjustmentModal
        onClose={onClose}
        selectedProduct={selectedProduct}
      />
    </Formik>
  )
}

export default Wrapper
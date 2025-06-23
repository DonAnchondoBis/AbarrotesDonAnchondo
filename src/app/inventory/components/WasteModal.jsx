'use client'

import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Grid,
  TextField
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'WasteModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FEF7E5',
  borderRadius: 16,
  boxShadow: 24,
  padding: '2rem',
  width: 420,
  [`& .${classes.header}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  [`& .${classes.divider}`]: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D8CBB3',
    marginBottom: '1.5rem'
  },
  [`& .${classes.label}`]: {
    color: '#7A5C40',
    fontSize: 14
  },
  [`& .${classes.textField}`]: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#FEF7E5',
      height: 32,
      '& fieldset': { borderColor: '#B19A7B' },
      '&:hover fieldset': { borderColor: '#B19A7B' },
      '&.Mui-focused fieldset': { borderColor: '#7A5C40' },
      '& input': { color: '#1F1F1F', fontSize: 14 }
    }
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  },
  [`& .${classes.saveButton}`]: {
    padding: '0.5rem 2rem',
    backgroundColor: '#5A7D2A',
    color: 'white',
    textTransform: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#4C681F' }
  },
  [`& .${classes.closeButton}`]: {
    backgroundColor: '#FEF7E5',
    border: '1px solid #B19A7B',
    width: 24,
    height: 24,
    padding: 0,
    '&:hover': { backgroundColor: '#f1e3cb' }
  },
  [`& .${classes.closeIcon}`]: {
    color: '#7A5C40',
    fontSize: 16
  },
  [`& .${classes.title}`]: {
    color: '#8B0002',
    fontWeight: 'bold'
  }
}))

const getWasteInitialValues = () => ({
  product: '',
  quantity: '',
  expiration: '',
  reason: ''
})

const getWasteValidationSchema = () =>
  Yup.object().shape({
    product: Yup.string().required('Product is required'),
    quantity: Yup.number().required('Quantity is required').min(1, 'Min 1'),
    expiration: Yup.date().required('Expiration date is required'),
    reason: Yup.string().required('Reason is required')
  })

const WasteModal = ({ open, onClose, onRegister }) => {
  const initialValues = getWasteInitialValues()

  return (
    <Modal open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={getWasteValidationSchema()}
        onSubmit={(values, { resetForm }) => {
          onRegister(values)
          resetForm()
          onClose()
        }}
      >
        {({ values, handleChange, errors, touched, resetForm }) => (
          <Form>
            <Container>
              <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                  Register Waste
                </Typography>
                <IconButton
                  onClick={() => {
                    resetForm()
                    onClose()
                  }}
                  className={classes.closeButton}
                >
                  <CloseIcon className={classes.closeIcon} />
                </IconButton>
              </div>

              <div className={classes.divider} />

              {[{ name: 'product', label: 'Product:' },
                { name: 'quantity', label: 'Quantity:' },
                { name: 'expiration', label: 'Expiration Date:', type: 'date' },
                { name: 'reason', label: 'Reason:', multiline: true }].map(({ name, label, type, multiline }) => (
                <Grid container spacing={2} alignItems="center" key={name} style={{ marginBottom: '1rem' }}>
                  <Grid item xs={4}>
                    <Typography className={classes.label}>{label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name={name}
                      type={type || 'text'}
                      multiline={multiline || false}
                      rows={multiline ? 2 : undefined}
                      value={values[name]}
                      onChange={handleChange}
                      className={classes.textField}
                      error={touched[name] && Boolean(errors[name])}
                      helperText={touched[name] && errors[name] ? errors[name] : ''}
                      InputLabelProps={type === 'date' ? { shrink: true } : {}}
                    />
                  </Grid>
                </Grid>
              ))}

              <div className={classes.buttonContainer}>
                <Button type="submit" className={classes.saveButton}>
                  Save
                </Button>
              </div>
            </Container>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default WasteModal
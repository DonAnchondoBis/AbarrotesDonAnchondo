'use client'

import {
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Grid
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'EditProductModal'
const classes = getClassPrefixer(displayName)

const getAddProductInitialValues = () => ({
  name: '',
  sku: '',
  unit: '',
  stock: '',
  price: '',
})

const getAddProductValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required('Name is required'),
    sku: Yup.string().required('SKU is required'),
    unit: Yup.string().required('Unit is required'),
    stock: Yup.number()
      .required('Stock is required')
      .min(0, 'Stock cannot be negative'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price cannot be negative'),
  })

const Container = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FEF7E5',
  borderRadius: 16,
  boxShadow: 24,
  padding: '2rem',
  width: 360,
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
    margin: '0.5rem 0 1.5rem 0'
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

const EditProductModal = ({ open, onClose, product, onSave, isNew = false }) => {
  const defaultValues = getAddProductInitialValues()

  return (
    <Modal open={open} onClose={onClose}>
      <Formik
        initialValues={product || defaultValues}
        validationSchema={isNew ? getAddProductValidationSchema() : null}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          const formatted = isNew
            ? {
                product: { name: values.name },
                sku: values.sku,
                unit: values.unit,
                stock: Number(values.stock),
                price: Number(values.price),
              }
            : values

          onSave(formatted)
          onClose()
          resetForm()
        }}
      >
        {({ values, handleChange, resetForm, errors, touched }) => (
          <Form>
            <Container>
              <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                  {product ? 'Edit Product' : 'Add Product'}
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

              {[{ name: 'name', label: 'Name:' },
                { name: 'sku', label: 'SKU:' },
                { name: 'unit', label: 'Unit of Measure:' },
                { name: 'stock', label: 'Stock:' },
                { name: 'price', label: 'Price:' }].map(({ name, label }) => (
                <Grid container spacing={2} alignItems="center" key={name} style={{ marginBottom: '1rem' }}>
                  <Grid item xs={4}>
                    <Typography className={classes.label}>{label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name={name}
                      type={name === 'stock' || name === 'price' ? 'number' : 'text'}
                      value={values[name]}
                      onChange={handleChange}
                      className={classes.textField}
                      error={touched[name] && Boolean(errors[name])}
                      helperText={touched[name] && errors[name] ? errors[name] : ''}
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

export default EditProductModal

'use client'
import {
  Button,
  IconButton,
  Typography as T,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Formik, Form, Field, useFormikContext } from 'formik'
import getClassPrefixer from '~/app/UI/classPrefixer'
import TextField from '~/app/UI/Shared/FormikTextField'
import SelectField from '~/app/UI/Shared/FormikSelect'
import { getAddProductValidationSchema, getAddProductInitialValues } from '~/app/inventory/utils'
import { useToken } from '~/app/store/useToken'
import { useState } from 'react'
import Image from 'next/image'
import Loading from '~/app/UI/Shared/Loading'
import { UnitOptions } from '~/Libs/enums'
import apiFetch from '~/app/Lib/apiFetch'

const displayName = 'ModalAddLots'
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
  [`& .${classes.uploadContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start'
  },
  [`& .${classes.uploadButton}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.main,
    '&:hover': { backgroundColor: theme.palette.primary.dark }
  },
  [`& .${classes.hiddenInput}`]: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  },
  [`& .${classes.imagePreview}`]: {
    width: '100%',
    height: '150px',
    objectFit: 'contain',
    marginTop: '1rem',
    border: `1px dashed ${theme.palette.primary.light}`,
    borderRadius: '0.5rem',
    backgroundColor: '#f8f8f8',
  },
  [`& .${classes.fileName}`]: {
    margin: '0.5rem 0',
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))

const ImageUpload = ({ field, form }) => {
  const [preview, setPreview] = useState(null)
  const [filename, setFilename] = useState('')
  const { errors, touched } = form

  const handleChange = event => {
    const file = event.currentTarget.files[0]
    if (!file) return

    setFilename(file.name)
    form.setFieldValue(field.name, file)

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreview(reader.result)
    }
  }

  return (
    <div className={classes.uploadContainer}>
      <T color="primary" variant="body2">Product Image:</T>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        className={classes.uploadButton}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className={classes.hiddenInput}
        />
      </Button>
      {filename && <T className={classes.fileName}>{filename}</T>}
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          className={classes.imagePreview}
          width={300}
          height={150}
          style={{ objectFit: 'contain', marginTop: '1rem', borderRadius: '0.5rem' }}
        />
      )}
      {touched[field.name] && errors[field.name] && (
        <T color="error" variant="caption" sx={{ mt: 1 }}>
          {errors[field.name]}
        </T>
      )}
    </div>
  )
}

const ModalAddLots = ({ onClose }) => {
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
            <Field
              name="image"
              component={ImageUpload}
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

const Wrapper = ({ onClose, products, setSnackbarMessage, refresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()
  const handleSubmit = async values => {
    setIsLoading(true)
    const formData = new FormData()
    const { image, ...data } = values

    formData.append('file', image)
    formData.append('data', JSON.stringify(data))
    const response = await apiFetch({
      url: '/api/product',
      method: 'POST',
      payload: formData,
      token,
    })
    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({ message: 'Error adding the product', severity: 'error' })
    } else {
      refresh()
      setSnackbarMessage({ message: 'Product added successfully', severity: 'success' })
      onClose()
    }
  }

  const validationSchema = getAddProductValidationSchema()
  const initialValues = getAddProductInitialValues()

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
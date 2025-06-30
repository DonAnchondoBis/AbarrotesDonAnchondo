'use client'

import {
  Button,
  IconButton,
  Typography as T,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { Formik, Form, Field } from 'formik'
import { useState } from 'react'
import apiFetch from '~/app/Lib/apiFetch'
import TextField from '~/app/UI/Shared/FormikTextField'
import { getAddUserValidationSchema } from './utils'
import Loading from '~/app/UI/Shared/Loading'
import { useToken } from '~/app/store/useToken'

const displayName = 'AddUserModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [`& .${classes.modalContainer}`]: {
    width: '400px',
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
  [`& .${classes.buttonGroup}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
    gap: '1rem'
  },
}))

const AddUserForm = ({ onClose, values, setFieldValue, isValid, dirty }) => {
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Add User
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
              component={TextField}
              variant="outlined"
            />
            <Field
              name="username"
              label="Username"
              component={TextField}
              variant="outlined"
            />
            <Field
              name="password"
              label="Password"
              type="password"
              component={TextField}
              password
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                name="role"
                value={values.role}
                onChange={e => setFieldValue('role', e.target.value)}
                label="Role"
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="CASHIER">CASHIER</MenuItem>
                <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className={classes.buttonGroup}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!dirty || !isValid}
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  )
}

const AddUserModal = ({ open, onClose, onUserAdded, setSnackbarMessage }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()

  const initialValues = {
    name: '',
    username: '',
    password: '',
    role: '',
    active: true
  }

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true)
    const response = await apiFetch({
      url: '/api/user',
      method: 'POST',
      payload: values,
      token,
    })

    if (response.error) {
      setSnackbarMessage({
        message: 'Error adding the user',
        severity: 'error'
      })
    } else {
      setSnackbarMessage({
        message: 'User added successfully',
        severity: 'success'
      })
      onUserAdded(response)
      resetForm()
      onClose()
    }
    setIsLoading(false)
  }

  if (!open) return null

  if (isLoading) return <Loading />

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={getAddUserValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty, values, setFieldValue }) => (
          <AddUserForm
            onClose={onClose}
            values={values}
            setFieldValue={setFieldValue}
            isValid={isValid}
            dirty={dirty}
          />
        )}
      </Formik>
    </>
  )
}

export default AddUserModal
'use client'

import {
  Button,
  IconButton,
  Typography as T,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useFormikContext, Formik, Form, Field } from 'formik'
import Loading from '~/app/UI/Shared/Loading'

import TextField from '~/app/UI/Shared/FormikTextField'
import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import { useState } from 'react'
import { getEditUserValidationSchema } from './utils'

const displayName = 'EditUserModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  [`& .${classes.modalContainer}`]: {
    width: '35vw',
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
  [`& .${classes.buttonGroup}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
    gap: '1rem'
  },
}))

const EditUserForm = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()

  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Edit User
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
              component={TextField}
              label="Name"
              variant="outlined"
            />
            <Field
              name="username"
              component={TextField}
              label="Username"
              variant="outlined"
            />
            <Field
              name="password"
              component={TextField}
              variant="outlined"
              label="Password"
              type="password"
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Field
                name="role"
                as={Select}
                label="Role"
                variant="outlined"
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="CASHIER">CASHIER</MenuItem>
                <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
              </Field>
            </FormControl>
          </div>

          <div className={classes.buttonGroup}>
            <Button
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!dirty || !isValid}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  )
}

const Wrapper = ({ onClose, user, setSnackbarMessage, refresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()
  const handleSubmit = async values => {
    setIsLoading(true)
    const payload = {
      name: values.name,
      username: values.username,
      role: values.role,
      active: values.active,
      ...(values.password ? { password: values.password } : {}),
    }

    const response = await apiFetch({
      url: `/api/user/${user.id}`,
      method: 'PATCH',
      payload,
      token
    })

    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({
        message: 'Error updating user.',
        severity: 'error'
      })
    } else {
      refresh()
      setSnackbarMessage({
        message: 'User updated successfully.',
        severity: 'success'
      })
      onClose()
    }
    setIsLoading(false)
  }

  const validationSchema = getEditUserValidationSchema()
  const initialValues = {
    name: user?.name || '',
    username: user?.username || '',
    role: user?.role || '',
    active: user?.active ?? true,
    password: ''
  }
  if (isLoading) return <Loading />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <EditUserForm
        onClose={onClose}
      />
    </Formik>
  )
}


export default Wrapper
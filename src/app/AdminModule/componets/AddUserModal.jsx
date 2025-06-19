'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { useState } from 'react'
import apiFetch from '~/app/Lib/apiFetch'
import TextField from '~/app/UI/Shared/FormikTextField'
import { getAddUserValidationSchema } from './utils'
import Loading from '~/app/UI/Shared/Loading'
import { useToken } from '~/app/store/useToken'

const AddUserModal = ({ open, onClose, onUserAdded }) => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()

  const initialValues = {
    name: '',
    username: '',
    password: '',
    role: 'CASHIER',
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
        message: response.error || 'Error al agregar usuario',
        severity: 'error'
      })
    } else {
      setSnackbarMessage({
        message: 'Usuario agregado correctamente',
        severity: 'success'
      })
      onUserAdded(response) // Pasamos el usuario agregado al padre para actualizar la lista
      resetForm()
      onClose()
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Usuario</DialogTitle>

      {isLoading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={getAddUserValidationSchema()}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty, values, setFieldValue }) => (
            <Form>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Field
                  name="name"
                  label="Nombre"
                  component={TextField}
                  fullWidth
                />
                <Field
                  name="username"
                  label="Username"
                  component={TextField}
                  fullWidth
                />
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  component={TextField}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue('role', e.target.value)}
                    label="Rol"
                  >
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="CASHIER">CASHIER</MenuItem>
                    <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarMessage?.severity}>
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}

export default AddUserModal;

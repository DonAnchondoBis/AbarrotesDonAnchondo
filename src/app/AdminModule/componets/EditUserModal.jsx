'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import TextField from '~/app/UI/Shared/FormikTextField'
import { Select, InputLabel, FormControl } from '@mui/material'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import { useState, useEffect } from 'react'
import { getEditUserValidationSchema } from './utils'

const EditUserModal = ({ open, onClose, user, onSuccess }) => {
  const { token } = useToken()
  const [snackbar, setSnackbar] = useState(null)

  const initialValues = {
    name: user?.name || '',
    username: user?.username || '',
    role: user?.role || 'CASHIER',
    active: user?.active ?? true,
    password: ''
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const response = await apiFetch({
      url: `/api/user/${user.id}`,
      method: 'PATCH',
      payload: {
        name: values.name,
        username: values.username,
        role: values.role,
        active: values.active,
        ...(values.password ? { password: values.password } : {}),
      },
      token
    })

    if (response?.error) {
      setSnackbar({ message: 'Error updating user.', severity: 'error' })
    } else {
      setSnackbar({ message: 'User updated successfully.', severity: 'success' })
      onSuccess(response)
      onClose()
      resetForm()
    }

    setSubmitting(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={getEditUserValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isValid, dirty, isSubmitting }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Field name="name" component={TextField} label="Nombre" fullWidth />
                <Field name="username" component={TextField} label="Username" fullWidth />
                <Field name="password" component={TextField} label="Password (optional)" fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Field name="role" as={Select} label="Rol">
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="CASHIER">CASHIER</MenuItem>
                    <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
                  </Field>
                </FormControl>
                <DialogActions>
                  <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" variant="contained" disabled={!dirty || !isValid || isSubmitting}>
                    Guardar
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar?.severity}>{snackbar?.message}</Alert>
      </Snackbar>
    </>
  )
}

export default EditUserModal

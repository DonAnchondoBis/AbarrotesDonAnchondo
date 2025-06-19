'use client'

import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, Snackbar, Alert
} from '@mui/material'
import { useState } from 'react'
import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'

const DeleteUserModal = ({ open, onClose, user, onSuccess }) => {
  const { token } = useToken()
  const [isLoading, setIsLoading] = useState(false)
  const [snackbar, setSnackbar] = useState(null)

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await apiFetch({
      url: `/api/user/${user.id}`,
      method: 'DELETE',
      token,
    })

    if (response?.error) {
      setSnackbar({ message: 'Error deleting user.', severity: 'error' })
    } else {
      setSnackbar({ message: 'User deleted successfully.', severity: 'success' })
      onSuccess(user.id)
      
      onClose()
    }

    setIsLoading(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar al usuario{' '}
            <strong>{user?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button color="error" onClick={handleDelete} disabled={isLoading}>
            Eliminar
          </Button>
        </DialogActions>
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

export default DeleteUserModal


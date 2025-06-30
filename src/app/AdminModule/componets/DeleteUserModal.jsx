'use client'

import {
  Button,
  IconButton,
  Typography as T,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useToken } from '~/app/store/useToken'
import apiFetch from '~/app/Lib/apiFetch'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'

const displayName = 'DeleteUserModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
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
    gap: '1ch',
  },
  [`& .${classes.header}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
    gap: '1rem',
  },
  [`& .${classes.btn}`]: {
    color: theme.palette.background.main,
  },
}))

const DeleteUserModal = ({ onClose, handleDelete, user }) => {
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Delete User
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 3 }} />
        <T color='primary' variant='h6' textAlign='center'>
          Confirm User Deletion
        </T>
        <T color='primary' variant='body1' textAlign='center'>
          Are you sure you want to delete <strong>{user?.name || 'this user'}</strong>?
        </T>
        <T color='error.main' variant='body2' textAlign='center'>
          This action will permanently remove the user account. This cannot be undone.
        </T>
        <div className={classes.buttonContainer}>
          <Button
            onClick={onClose}
            color='primary'
            variant='outlined'
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color='error'
            variant='contained'
            className={classes.btn}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Container>
  )
}

const Wrapper = ({ onClose, user, setSnackbarMessage, refresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await apiFetch({
      url: `/api/user/${user.id}`,
      method: 'DELETE',
      token,
    })

    if (response.error) {
      setIsLoading(false)
      setSnackbarMessage({
        message: 'Error deleting user',
        severity: 'error'
      })
    } else {
      setSnackbarMessage({
        message: 'User deleted successfully',
        severity: 'success'
      })
      await refresh()

    }
    onClose()
    setIsLoading(false)
  }

  if (isLoading) return <Loading />

  return (
    <DeleteUserModal
      user={user}
      onClose={onClose}
      handleDelete={handleDelete}
    />
  )
}

export default Wrapper
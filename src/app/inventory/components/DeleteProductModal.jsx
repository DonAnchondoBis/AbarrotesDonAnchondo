'use client'

import {
  Button,
  IconButton,
  Typography as T,
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

import { useToken } from '~/app/store/useToken'
import apiFetch from '~/app/Lib/apiFetch'
import { useState } from 'react'
import Loading from '~/app/UI/Shared/Loading'

const displayName = 'DeleteProductModal'
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
    gap: '1ch',
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
    marginTop: '1.5rem',
    gap: '1rem',
  },
  [`& .${classes.btn}`]: {
    color: theme.palette.background.main,
  },
}))

const DeleteProductModal = ({ onClose, handleDelete, selectedProduct }) => {
  return (
    <Container>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <T color="primary" variant="h5">
            Delete Product
          </T>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider sx={{ mb: 3 }} />
        <T color='primary' variant='h6' textAlign='center'>
          Confirm Product Deletion
        </T>
        <T color='primary' variant='body1' textAlign='center'>
          Are you sure you want to delete <strong>{selectedProduct?.name || 'this product'}</strong> from inventory?
        </T>
        <T color='darkRed' variant='body2' textAlign='center'>
          This action will permanently remove the product and all its associated inventory data. This cannot be undone.
        </T>
        <div className={classes.buttonContainer}>
          <Button
            onClick={onClose}
            color='primary'
            variant='outlined'
            className={classes.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color='darkRed'
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

const Wrapper = ({ refresh, setSnackbarMessage, onClose, selectedProduct }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useToken()
  const handleDelete = async () => {
    setIsLoading(true)
    const response = await apiFetch({
      url: `/api/product/${selectedProduct.id}`,
      method: 'DELETE',
      token,
    })
    if (response.error) {
      const message = response.error === 'Product has stock' ? 'Product has stock, cannot delete' : 'Failed to delete product, please try again later'
      setIsLoading(false)
      setSnackbarMessage({ message, severity: 'error' })
    } else {
      refresh()
      setSnackbarMessage({ message: 'Product deleted successfully', severity: 'success' })
      setIsLoading(false)
      onClose()
    }
  }

  if (isLoading) return <Loading />

  return (
    <DeleteProductModal
      selectedProduct={selectedProduct}
      onClose={onClose}
      handleDelete={handleDelete}
    />
  )
}

export default Wrapper
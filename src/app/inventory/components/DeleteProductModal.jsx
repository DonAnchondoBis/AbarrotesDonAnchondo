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

const DeleteProductModal = ({ onClose, onDelete, selectedProduct }) => {
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
          {/* TODO add functionality of delete  */}
          <Button
            onClick={() => {}}
            color='primary'
            variant='outlined'
            className={classes.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
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

export default DeleteProductModal
'use client'

import {
  Button,
  IconButton,
  Modal,
  Typography as T,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'DeleteProductModal'
const classes = getClassPrefixer(displayName)

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
  [`& .${classes.message}`]: {
    textAlign: 'center',
    color: '#7A5C40',
    marginBottom: '1.5rem'
  },
  [`& .${classes.subMessage}`]: {
    textAlign: 'center',
    color: '#7A5C40',
    fontSize: 13,
    marginBottom: '2rem'
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [`& .${classes.deleteButton}`]: {
    padding: '0.5rem 2rem',
    backgroundColor: '#8B0002',
    color: 'white',
    textTransform: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#6F0002' }
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

const DeleteProductModal = ({ open, onClose, onDelete }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Container>
        <div className={classes.header}>
          <T variant="h6" className={classes.title}>
            Delete Product
          </T>
          <IconButton onClick={onClose} className={classes.closeButton}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </div>

        <div className={classes.divider} />

        <T className={classes.message}>
          Are you sure you want to delete this product from the inventory?
        </T>
        <T className={classes.subMessage}>
          This action cannot be undone.
        </T>

        <div className={classes.buttonContainer}>
          <Button onClick={onDelete} className={classes.deleteButton}>
            Delete
          </Button>
        </div>
      </Container>
    </Modal>
  )
}

export default DeleteProductModal
import React from 'react';
import {
  Box,
  Button,
  Modal,
  Typography
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#f7efd8',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 400,
  textAlign: 'center'
};

export default function DeleteProductModal({ open, onClose, onDelete }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" color="error" mb={2}>
          Confirm Delete
        </Typography>
        <Typography mb={3}>
          Are you sure you want to delete this product?
        </Typography>
        <Button
          onClick={onDelete}
          variant="contained"
          color="error"
          sx={{ mr: 1 }}
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

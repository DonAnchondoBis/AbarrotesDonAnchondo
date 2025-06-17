'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#FEF7E5',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 420,
};

export default function DeleteProductModal({ open, onClose, onDelete }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#8B0002', fontWeight: 'bold' }}>
            Delete
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              border: '1px solid #7A5C40',
              borderRadius: '50%',
              width: 28,
              height: 28,
              color: '#7A5C40',
              padding: 0,
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0D6C1' }} />

        <Typography sx={{ mb: 1.5, textAlign: 'center', color: '#7A5C40' }}>
          Are you sure you want to delete this product from the inventory?
        </Typography>
        <Typography sx={{ mb: 3, textAlign: 'center', color: '#7A5C40', fontSize: 13 }}>
          This action cannot be undone.
        </Typography>

        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={onDelete}
            sx={{
              px: 4,
              py: 1,
              bgcolor: '#8B0002',
              color: 'white',
              textTransform: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#6F0002'
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

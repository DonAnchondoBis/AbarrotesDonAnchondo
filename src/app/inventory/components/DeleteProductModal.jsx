// DeleteProductModal.jsx
import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#FEF7E5', // Background color
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 380,
};

export default function DeleteProductModal({ open, onClose, onDelete }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#B19A7B' }}>Confirm Delete</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: '#7A5C40' }} />
          </IconButton>
        </Box>

        <Typography sx={{ mb: 3, color: '#1F1F1F' }}>
          Are you sure you want to delete this product?
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            onClick={onClose}
            sx={{
              bgcolor: '#D4B08C',
              color: '#1F1F1F',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#C69C7C' }
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onDelete}
            sx={{
              bgcolor: '#B19A7B',
              color: 'white',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#A18A6A' }
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

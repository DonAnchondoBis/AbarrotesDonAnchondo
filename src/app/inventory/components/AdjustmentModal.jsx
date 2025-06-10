// AdjustmentModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography
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
  width: 400,
};

export default function AdjustmentModal({ open, onClose, product, onAdjust }) {
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (product?.stock !== undefined) {
      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = () => {
    onAdjust(stock);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#B19A7B' }}>Adjust Inventory</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: '#7A5C40' }} />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="New Stock Quantity"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          margin="dense"
          sx={{
            bgcolor: '#F5E7CE',
            borderRadius: 1,
            input: { color: '#1F1F1F' },
            label: { color: '#7A5C40' }
          }}
        />

        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 2,
            bgcolor: '#B19A7B',
            color: 'white',
            textTransform: 'none',
            borderRadius: '20px',
            '&:hover': { bgcolor: '#A18A6A' }
          }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

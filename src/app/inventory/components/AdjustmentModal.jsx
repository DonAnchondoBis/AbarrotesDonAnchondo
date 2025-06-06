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
  bgcolor: '#f7efd8',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 400,
};

export default function AdjustmentModal({ open, onClose, onAdjust, product }) {
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    if (product?.stock !== undefined) {
      setNewStock(product.stock);
    }
  }, [product]);

  const handleSubmit = () => {
    if (newStock !== '') {
      onAdjust(newStock);
      setNewStock('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Inventory Adjustment</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="New Stock Level"
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          margin="dense"
          sx={{ bgcolor: '#f5e7ce', borderRadius: 1 }}
        />

        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 2,
            bgcolor: '#a1866f',
            color: 'white',
            textTransform: 'none',
            borderRadius: '20px'
          }}
        >
          Adjust
        </Button>
      </Box>
    </Modal>
  );
}

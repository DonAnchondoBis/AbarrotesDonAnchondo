import React, { useState } from 'react';
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

export default function WasteModal({ open, onClose, onRegister }) {
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    if (quantity) {
      onRegister(quantity);
      setQuantity('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Register Waste</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Quantity wasted"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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
            borderRadius: '20px',
            textTransform: 'none'
          }}
        >
          Register
        </Button>
      </Box>
    </Modal>
  );
}

// WasteModal.jsx
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
  bgcolor: '#FEF7E5',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 400,
};

export default function WasteModal({ open, onClose, onRegister }) {
  const [form, setForm] = useState({ product: '', quantity: '', expiration: '', reason: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRegister(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#B19A7B' }}>Register Waste</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: '#7A5C40' }} />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Product"
          name="product"
          value={form.product}
          onChange={handleChange}
          margin="dense"
          sx={{ bgcolor: '#F5E7CE', borderRadius: 1, input: { color: '#1F1F1F' }, label: { color: '#7A5C40' } }}
        />
        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          margin="dense"
          type="number"
          sx={{ bgcolor: '#F5E7CE', borderRadius: 1, input: { color: '#1F1F1F' }, label: { color: '#7A5C40' } }}
        />
        <TextField
          fullWidth
          label="Expiration Date"
          name="expiration"
          value={form.expiration}
          onChange={handleChange}
          margin="dense"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: '#F5E7CE', borderRadius: 1, input: { color: '#1F1F1F' }, label: { color: '#7A5C40' } }}
        />
        <TextField
          fullWidth
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={2}
          sx={{ bgcolor: '#F5E7CE', borderRadius: 1, input: { color: '#1F1F1F' }, label: { color: '#7A5C40' } }}
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
          Save
        </Button>
      </Box>
    </Modal>
  );
}

// EditProductModal.jsx
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
  bgcolor: '#FEF7E5', // Background color
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 400,
};

export default function EditProductModal({ open, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit: '',
    stock: '',
    price: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: '', sku: '', unit: '', stock: '', price: '' });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#B19A7B' }}>
            {product ? 'Edit Product' : 'Add Product'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: '#7A5C40' }} />
          </IconButton>
        </Box>

        {['name', 'sku', 'unit', 'stock', 'price'].map((field) => (
          <TextField
            key={field}
            fullWidth
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            type={field === 'stock' || field === 'price' ? 'number' : 'text'}
            value={formData[field] ?? ''}
            onChange={handleChange}
            margin="dense"
            sx={{
              bgcolor: '#F5E7CE',
              borderRadius: 1,
              input: { color: '#1F1F1F' },
              label: { color: '#7A5C40' }
            }}
          />
        ))}

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

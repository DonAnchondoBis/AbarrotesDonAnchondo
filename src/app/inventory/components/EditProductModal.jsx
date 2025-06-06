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

export default function EditProductModal({ open, onClose, product, onSave }) {
  const [formData, setFormData] = useState(product || {
    name: '',
    sku: '',
    unit: '',
    stock: '',
    price: ''
  });

  useEffect(() => {
    setFormData(product || {
      name: '',
      sku: '',
      unit: '',
      stock: '',
      price: ''
    });
  }, [product]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" color="error">
            {product ? 'Edit Product' : 'Add Product'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="dense"
          sx={{ bgcolor: '#f5e7ce', borderRadius: 1 }}
        />

        <TextField
          fullWidth
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          margin="dense"
          sx={{ bgcolor: '#f5e7ce', borderRadius: 1 }}
        />

        <TextField
          fullWidth
          label="Unit of Measure"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          margin="dense"
          sx={{ bgcolor: '#f5e7ce', borderRadius: 1 }}
        />

        <TextField
          fullWidth
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          margin="dense"
          sx={{ bgcolor: '#f5e7ce', borderRadius: 1 }}
        />

        <TextField
          fullWidth
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
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
          Save
        </Button>
      </Box>
    </Modal>
  );
}

'use client';

import { useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';

export default function EditProductModal({ open, onClose, product, onSave }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      sku: '',
      unit: '',
      stock: '',
      price: ''
    },
    onSubmit: (values) => {
      onSave(values);
      onClose();
    }
  });

  useEffect(() => {
    if (product) {
      formik.setValues(product);
    } else {
      formik.resetForm();
    }
  }, [product]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#FEF7E5',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 360,
        }}
      >
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: '#8B0002', fontWeight: 'bold' }}>
              {product ? 'Edit Product' : 'Add Product'}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: '#FEF7E5',
                border: '1px solid #B19A7B',
                width: 24,
                height: 24,
                p: 0,
                '&:hover': { bgcolor: '#f1e3cb' }
              }}
            >
              <CloseIcon sx={{ color: '#7A5C40', fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box
            mt={1}
            mb={2}
            sx={{ width: '100%', height: '1px', backgroundColor: '#D8CBB3' }}
          />
        </Box>

        {[{ name: 'name', label: 'Name:' },
          { name: 'sku', label: 'SKU:' },
          { name: 'unit', label: 'Unit of Measure:' },
          { name: 'stock', label: 'Stock:' },
          { name: 'price', label: 'Price:' }
        ].map(({ name, label }) => (
          <Grid container spacing={2} alignItems="center" key={name} sx={{ mb: 1 }}>
            <Grid item xs={4}>
              <Typography sx={{ color: '#7A5C40', fontSize: 14 }}>{label}</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name={name}
                type={name === 'stock' || name === 'price' ? 'number' : 'text'}
                value={formik.values[name]}
                onChange={formik.handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '10px',
                    backgroundColor: '#FEF7E5',
                    height: 32,
                    '& fieldset': { borderColor: '#B19A7B' },
                    '&:hover fieldset': { borderColor: '#B19A7B' },
                    '&.Mui-focused fieldset': { borderColor: '#7A5C40' },
                    input: { color: '#1F1F1F', fontSize: 14 }
                  }
                }}
              />
            </Grid>
          </Grid>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            type="submit"
            sx={{
              px: 4,
              py: 1,
              bgcolor: '#5A7D2A',
              color: 'white',
              textTransform: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#4C681F' }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

'use client';

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
import { useEffect } from 'react';

export default function WasteModal({ open, onClose, onRegister }) {
  const formik = useFormik({
    initialValues: {
      product: '',
      quantity: '',
      expiration: '',
      reason: ''
    },
    onSubmit: (values) => {
      onRegister(values);
      onClose();
    }
  });

  useEffect(() => {
    formik.resetForm();
  }, [open]);

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
          width: 420
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#8B0002', fontWeight: 'bold' }}>
            Register Waste
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: '#FEF7E5',
              border: '1px solid #B19A7B',
              width: 24,
              height: 24,
              p: 0,
              '&:hover': {
                bgcolor: '#f1e3cb'
              }
            }}
          >
            <CloseIcon sx={{ color: '#7A5C40', fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: '#D8CBB3',
            mb: 3
          }}
        />

        {[
          { name: 'product', label: 'Product:' },
          { name: 'quantity', label: 'Quantity:' },
          { name: 'expiration', label: 'Expiration Date:', type: 'date' },
          { name: 'reason', label: 'Reason:', multiline: true }
        ].map(({ name, label, type, multiline }) => (
          <Grid container spacing={2} alignItems="center" key={name} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Typography sx={{ color: '#7A5C40', fontSize: 14 }}>{label}</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name={name}
                type={type || 'text'}
                multiline={multiline || false}
                rows={multiline ? 2 : undefined}
                value={formik.values[name]}
                onChange={formik.handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '10px',
                    backgroundColor: '#FEF7E5',
                    height: !multiline ? 32 : undefined,
                    '& fieldset': {
                      borderColor: '#B19A7B'
                    },
                    '&:hover fieldset': {
                      borderColor: '#B19A7B'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7A5C40'
                    },
                    input: {
                      color: '#1F1F1F',
                      fontSize: 14
                    }
                  }
                }}
                InputLabelProps={type === 'date' ? { shrink: true } : {}}
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
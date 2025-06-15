import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function ModalLots({ open, onClose }) {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        style={{
          width: 600,
          background: theme.palette.background.main,
          borderRadius: 16,
          boxShadow: theme.shadows[24],
          padding: 32,
          outline: 'none',
          position: 'absolute',
          top: '20%',
            left: '30%',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            style={{
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          >
            New product
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon style={{ color: theme.palette.primary.main }} />
          </IconButton>
        </div>
        <Divider style={{ marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <TextField
            label="Select Product"
            select
            fullWidth
            sx={{
              background: 'transparent',
              borderRadius: 8,
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                color: theme.palette.text.primary,
              },
              '& label': { color: theme.palette.text.secondary },
            }}
            value=""
            onChange={() => {}}
          >
            <MenuItem value="">Product 1</MenuItem>
            <MenuItem value="">Product 2</MenuItem>
          </TextField>
          <TextField
            label="Quantity"
            fullWidth
            sx={{
              background: 'transparent',
              borderRadius: 8,
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                color: theme.palette.text.primary,
              },
              '& label': { color: theme.palette.text.secondary },
            }}
            value=""
            onChange={() => {}}
          />
        </div>
        <TextField
          label="Expiration Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            background: 'transparent',
            borderRadius: 8,
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              color: theme.palette.text.primary,
            },
            '& label': { color: theme.palette.text.secondary },
          }}
          value=""
          onChange={() => {}}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <Button
            variant="contained"
            style={{
                background: theme.palette.success.main,
                color: theme.palette.getContrastText(theme.palette.success.main),
                textTransform: 'none',
                fontSize: 20,
                fontWeight: 400,
            }}
            >
            Save
            </Button>
        </div>
      </div>
    </Modal>
  );
}
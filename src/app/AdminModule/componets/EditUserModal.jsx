'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useState, useEffect } from 'react';

const EditUserModal = ({ open, onClose, user, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'CASHIER',
    active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        role: user.role || 'CASHIER',
        active: user.active ?? true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      active: e.target.checked
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Rol</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Rol"
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="CASHIER">CASHIER</MenuItem>
            <MenuItem value="MANAGER">MANAGER</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;

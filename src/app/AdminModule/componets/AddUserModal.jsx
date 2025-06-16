'use client'

import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from '@mui/material';

const AddUserModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar al usuario{' '}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

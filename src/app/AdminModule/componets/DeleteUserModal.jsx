'use client'

import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from '@mui/material';

const DeleteUserModal = ({ open, onClose, user, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar al usuario{' '}
          <strong>{user?.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;

'use client'

import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from '@mui/material';

const EditUserModal = ({ open, onClose, user, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar al usuario{' '}
          <strong>{user?.name}</strong>?
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

export default EditUserModal;

'use client'

import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteUserModal from './DeleteUserModal';
import EditUserModal from './EditUserModal';



const UsersTable = ({ search }) => {
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleClose = () => setAnchorEl(null);

  const handleOpenEdit = () => {
    handleClose();
    setEditOpen(true);
  };
  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedUser(null);
  };
  const handleConfirmEdit = () => {
    handleCloseEdit();
  };

  const handleOpenDelete = () => {
    handleClose();
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    handleCloseDelete();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('users.json');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  // 🔔 **Filtrado según el search input**
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de usuarios">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleClick(e, user)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleOpenEdit}>Editar</MenuItem>
        <MenuItem onClick={handleOpenDelete}>Eliminar</MenuItem>
      </Menu>

      <DeleteUserModal
        open={deleteOpen}
        onClose={handleCloseDelete}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
      />
      <EditUserModal
        open={editOpen}
        onClose={handleCloseEdit}
        user={selectedUser}
        onConfirm={handleConfirmEdit}
      />
    </TableContainer>
  );
};

export default UsersTable;

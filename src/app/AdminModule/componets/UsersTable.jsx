'use client'

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem, Snackbar, Alert
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import DeleteUserModal from './DeleteUserModal'
import EditUserModal from './EditUserModal'

const UsersTable = ({ users, search, fetchUsers }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [snackbar, setSnackbar] = useState(null)

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleOpenEdit = () => {
    handleCloseMenu()
    setEditOpen(true)
  }
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSelectedUser(null)
  }

  const handleOpenDelete = () => {
    handleCloseMenu()
    setDeleteOpen(true)
  }
  const handleCloseDelete = () => {
    setDeleteOpen(false)
    setSelectedUser(null)
  }

  const handleSuccess = (message, severity = 'success') => {
    setSnackbar({ message, severity })
    fetchUsers()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="User table">
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
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={e => handleClick(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenEdit}>Editar</MenuItem>
        <MenuItem onClick={handleOpenDelete}>Eliminar</MenuItem>
      </Menu>

      <EditUserModal
        open={editOpen}
        onClose={handleCloseEdit}
        user={selectedUser}
        onSuccess={() => handleSuccess('Usuario editado correctamente.')}
      />

      <DeleteUserModal
        open={deleteOpen}
        onClose={handleCloseDelete}
        user={selectedUser}
        onSuccess={() => handleSuccess('Usuario eliminado correctamente.')}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar?.severity}>{snackbar?.message}</Alert>
      </Snackbar>
    </>
  )
}

export default UsersTable

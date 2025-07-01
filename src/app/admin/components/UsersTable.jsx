'use client'

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu,
  MenuItem, Snackbar, Alert, TablePagination, Modal
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import DeleteUserModal from './DeleteUserModal'
import EditUserModal from './EditUserModal'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'UsersTable'
const classes = getClassPrefixer(displayName)

const Container = styled(TableContainer)(({ theme }) => ({
  [`& .${classes.TableContainer}`]: {
    width: '100%',
    border: `solid 3px ${theme.palette.primary.main}`,
    borderRadius: '1rem',
  },
  [`& .${classes.headerCell}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textAlign: 'center'
  }
}))

const UsersTableComponent = ({
  users,
  search,
  fetchUsers,
  editOpen,
  deleteOpen,
  onCloseEdit,
  onCloseDelete,
  selectedUser,
  setSelectedUser,
  snackbar,
  setSnackbar,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  onOpenEdit,
  onOpenDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handlePageChange = (_, newPage) => setPage(newPage)

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()))

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Container>
      <TableContainer className={classes.TableContainer} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="User table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Name</TableCell>
              <TableCell className={classes.headerCell}>User</TableCell>
              <TableCell className={classes.headerCell}>Role</TableCell>
              <TableCell className={classes.headerCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.username}</TableCell>
                <TableCell align="center">{user.role}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={e => handleMenuClick(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Users per page"
        />
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
          onOpenEdit()
          handleMenuClose()
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          onOpenDelete()
          handleMenuClose()
        }}>Delete</MenuItem>
      </Menu>

      <Modal open={editOpen} onClose={onCloseEdit}>
        <div>
          <EditUserModal
            setSnackbarMessage={setSnackbar}
            open={editOpen}
            onClose={onCloseEdit}
            user={selectedUser}
            refresh={fetchUsers}

          />
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={onCloseDelete}>
        <div>
          <DeleteUserModal
            setSnackbarMessage={setSnackbar}
            open={deleteOpen}
            onClose={onCloseDelete}
            user={selectedUser}
            refresh={fetchUsers}
          />
        </div>
      </Modal>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar?.severity}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const Wrapper = ({ users, search, fetchUsers }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbar, setSnackbar] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenEdit = () => setEditOpen(true)
  const handleCloseEdit = () => setEditOpen(false)
  const handleOpenDelete = () => setDeleteOpen(true)
  const handleCloseDelete = () => setDeleteOpen(false)

  return (
    <UsersTableComponent
      users={users}
      search={search}
      fetchUsers={fetchUsers}
      editOpen={editOpen}
      deleteOpen={deleteOpen}
      onCloseEdit={handleCloseEdit}
      onCloseDelete={handleCloseDelete}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      snackbar={snackbar}
      setSnackbar={setSnackbar}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      onOpenEdit={handleOpenEdit}
      onOpenDelete={handleOpenDelete}
    />
  )
}

export default Wrapper
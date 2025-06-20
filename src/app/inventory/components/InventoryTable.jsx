'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableContainer,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'InventoryTable'
const classes = getClassPrefixer(displayName)

const Container = styled(TableContainer)(({ theme }) => ({
  [`& .${classes.TableContainer}`]: {
    width: '100%',
    border: `solid 3px ${theme.palette.primary.main}`,
    borderRadius: '1rem',
  },
}))

const InventoryTable = ({ data = [], search = '', onEdit }) => {
  const filteredData = Array.isArray(data)
    ? data.filter(item => {
        const searchLower = search?.toLowerCase()
        return item?.product?.name?.toLowerCase().includes(searchLower)
      })
    : []

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const paginatedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

  const handleOpenMenu = (event, row) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null)
    setSelectedRow(null)
  }

  const handleEdit = () => {
    if (onEdit && selectedRow) onEdit(selectedRow)
    handleCloseMenu()
  }

  return (
    <Container>
      <TableContainer className={classes.TableContainer} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">SKU</Typography></TableCell>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">Product</Typography></TableCell>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">Unit</Typography></TableCell>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">Stock</Typography></TableCell>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">Price</Typography></TableCell>
              <TableCell align="center"><Typography color="primary.main" fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row?.sku || '-'}</TableCell>
                  <TableCell align="center">{row?.product?.name || '-'}</TableCell>
                  <TableCell align="center">{row?.unit || '-'}</TableCell>
                  <TableCell align="center">{row?.stock ?? '-'}</TableCell>
                  <TableCell align="center">{row?.price ? `$${row.price}` : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Products per page"
        />
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem disabled>Delete</MenuItem>
          <MenuItem disabled>Register Waste</MenuItem>
          <MenuItem disabled>Adjust Inventory</MenuItem>
        </Menu>
      </TableContainer>
    </Container>
  )
}

export default InventoryTable

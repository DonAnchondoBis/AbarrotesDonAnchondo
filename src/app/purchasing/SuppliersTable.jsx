'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography as T,
  TablePagination,
  TableContainer,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  border: `solid 3px ${theme.palette.primary.main}`,
  borderRadius: '1rem',
}))

const SuppliersTable = ({ search = '', suppliers = [] }) => {
  const filteredData = suppliers?.filter(item => item?.name?.toLowerCase().includes(search.toLowerCase()))

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const paginatedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">Name</T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">Email</T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">Phone</T>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.phone}</TableCell>
            </TableRow>
          ))}
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
    </StyledTableContainer>
  )
}

export default SuppliersTable

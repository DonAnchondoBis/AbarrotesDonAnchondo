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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  border: `solid 3px ${theme.palette.primary.main}`,
  borderRadius: '1rem',
}))

const InventoryTable = ({ search }) => {
  const data = [
    { producto: 'Teclado', cantidad: 25, ubicacion: 'Almacén A' },
    { producto: 'Mouse', cantidad: 40, ubicacion: 'Almacén B' },
  ]

  const filteredData = data.filter(item => 
    item.producto.toLowerCase().includes(search.toLowerCase())
  )

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
              <Typography color="primary.main" fontWeight="bold">Product</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight="bold">Amount</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight="bold">Location</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.producto}</TableCell>
              <TableCell align="center">{row.cantidad}</TableCell>
              <TableCell align="center">{row.ubicacion}</TableCell>
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

export default InventoryTable

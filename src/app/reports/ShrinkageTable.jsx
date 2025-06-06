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

const ShrinkageTable = ({ search }) => {
  const data = [
    { product: 'Keyboard', amount: 25, location: 'Warehouse A' },
    { product: 'Mouse', amount: 40, location: 'Warehouse B' }
  ]

  const filteredData = data.filter(item => 
    item.product.toLowerCase().includes(search.toLowerCase())
  )

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const paginatedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
              <Typography color="primary.main" fontWeight="bold">
                Product
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight="bold">
                Amount
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight="bold">
                Location
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.product}</TableCell>
              <TableCell align="center">{row.amount}</TableCell>
              <TableCell align="center">{row.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Products per page"
      />
    </StyledTableContainer>
  )
}

export default ShrinkageTable

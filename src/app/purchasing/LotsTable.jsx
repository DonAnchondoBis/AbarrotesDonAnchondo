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
  Modal
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import EditModal from './ModalLots'

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  border: `solid 3px ${theme.palette.primary.main}`,
  borderRadius: '1rem',
}))

const LotsTable = ({ search, lots = [] }) => {

  console.log('LotsTable', lots)
  const filteredData = lots?.filter(item => item.product.name.toLowerCase().includes(search.toLowerCase()))

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const paginatedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // 👇 Estas son las líneas agregadas
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedCompetitor, setSelectedCompetitor] = useState(null)
  const [setSnackbarMessage] = useState(() => () => {})

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
              <Typography color="primary.main" fontWeight="bold">Current Amount</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight="bold">Expiration Date</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.product.name}</TableCell>
              <TableCell align="center">{row.currentAmount}</TableCell>
              <TableCell align="center">{row.expirationDate}</TableCell>
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

export default LotsTable

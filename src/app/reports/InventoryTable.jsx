import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableContainer
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import getClassPrefixer from '~/app/UI/classPrefixer'
import EmptyState from './EmptyState'
import { SentimentDissatisfied } from '@mui/icons-material'
import { ReportButton } from './ReportButton'

const displayName = 'InventoryTable'
const classes = getClassPrefixer(displayName)

const Container = styled(TableContainer)(({ theme }) => ({
  [`& .${classes.TableContainer}`]: {
    width: '100%',
    border: `solid 3px ${theme.palette.primary.main}`,
    borderRadius: '1rem',
  },
  [`& .${classes.descriptionText}`]: {
    maxWidth: '200px',
    textAlign: 'center',
    margin: '0 auto',
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '1rem',
    color: theme.palette.background.main,
  },
}))

const InventoryTable = ({ data = [], search = '' }) => {
  const filteredData = data?.filter(item => {
    const searchLower = search?.toLowerCase()
    return (
      item?.product?.name?.toLowerCase().includes(searchLower)
    )
  })
  const formattedData = filteredData.reduce((acc, product) => {
    return {
      ...acc,
      [product.product.name]: {
        name: product.product.name,
        currentAmount: acc[product.product.name]?.currentAmount + product.currentAmount || product.currentAmount,
        expirationDate: new Date(acc[product.product.name]?.expirationDate ?? '2999-01-01') > new Date(product.expirationDate) ? product.expirationDate : acc[product.product.name]?.expirationDate
      }
    }
  }, {})

  const inventoryData = Object.values(formattedData ?? [])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const paginatedRows = inventoryData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  if (!inventoryData || inventoryData.length === 0) {
    return (
      <EmptyState
        icon={<SentimentDissatisfied sx={{ fontSize: 100, color: theme => theme.palette.primary.main }} />}
        title="No Inventory Data"
        description="There are no products available in the inventory."
      />
    )
  }

  return (
    <Container>
      <TableContainer className={classes.TableContainer} component={Paper}>
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
                <Typography color="primary.main" fontWeight="bold">Expires sooner</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.currentAmount}</TableCell>
                <TableCell align="center">
                  {row.expirationDate ?? 'No expiration date'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={inventoryData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Products per page"
        />
      </TableContainer>
      <div className={classes.buttonContainer}>
        <ReportButton category="inventory" data={data} />
      </div>
    </Container>
  )
}

export default InventoryTable

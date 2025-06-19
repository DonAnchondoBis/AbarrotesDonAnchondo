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
import getClassPrefixer from '../UI/classPrefixer'
import { SentimentDissatisfied } from '@mui/icons-material'
import EmptyState from './EmptyState'
import { ReportButton } from './ReportButton'

const displayName = 'SalesOfTheDayTable'
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

const SalesOfTheDayTable = ({ data = [], date = '' }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const salesDayData = data.filter(item => item?.date === date)
  const { total = '0', ...formattedData } = salesDayData.reduce((acc, item) => {
    item.products.forEach(productEntry => {
      const { product, quantityProduct } = productEntry
      const productName = product.name
      const productPrice = product.price
      const subtotal = productPrice * quantityProduct
      acc.total = acc.total ? acc.total + subtotal : subtotal
      if (acc[productName]) {
        acc[productName].quantity += quantityProduct
        acc[productName].subtotal += subtotal
      } else {
        acc[productName] = {
          name: productName,
          quantity: quantityProduct,
          price: productPrice,
          subtotal: subtotal
        }
      }
    })
    return acc
  }, {})

  const paginatedRows = Object.values(formattedData ?? {}).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!salesDayData || salesDayData.length === 0) {
    return (
      <EmptyState
        icon={<SentimentDissatisfied sx={{ fontSize: 100, color: theme => theme.palette.primary.main }} />}
        title="No sales found for this date."
        subtitle="Please try selecting another one."
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
                <T color="primary.main" fontWeight="bold">
                  Product
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="primary.main" fontWeight="bold">
                  Quantity
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="primary.main" fontWeight="bold">
                  Subtotal
                </T>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">${row.subtotal}</TableCell>
              </TableRow>
            ))}
            <TableRow key="total">
              <TableCell align="right" colSpan={2}>
                <T color="primary.main" fontWeight="bold">
                  Total:
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="green.main" fontWeight="bold">
                  ${total}
                </T>
              </TableCell>
            </TableRow>
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
          labelRowsPerPage="Sales per page"
        />
      </TableContainer>
      <div className={classes.buttonContainer}>
        <ReportButton category="salesOfTheDay" data={data} />
      </div>
    </Container>
  )
}

export default SalesOfTheDayTable

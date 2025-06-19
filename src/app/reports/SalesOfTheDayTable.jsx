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
  Button
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import getClassPrefixer from '../UI/classPrefixer'
import { SentimentDissatisfied } from '@mui/icons-material'
import EmptyState from './EmptyState'

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
  const paginatedRows = salesDayData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
                  TICKET #
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="primary.main" fontWeight="bold">
                  Products Sold
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="primary.main" fontWeight="bold">
                  Total
                </T>
              </TableCell>
              <TableCell align="center">
                <T color="primary.main" fontWeight="bold">
                  Date
                </T>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  {row.products.map((p, i) => (
                    <div key={i}>{p.product.name}</div>
                  ))}
                </TableCell>
                <TableCell align="center">{row.total}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
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
          labelRowsPerPage="Sales per page"
        />
      </TableContainer>
      <div className={classes.buttonContainer}>
        {/* TODO: Dani's button to generate reports need to be there */}
        <Button variant='contained' color='green' onClick={() => {}} >
          Generate Report
        </Button>
      </div>
    </Container>
  )
}

export default SalesOfTheDayTable

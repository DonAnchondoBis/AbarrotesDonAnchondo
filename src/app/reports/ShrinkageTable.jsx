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
  Tooltip
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import getClassPrefixer from '~/app/UI/classPrefixer'


const displayName = 'ShrinkageTable'
const classes = getClassPrefixer(displayName)

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  border: `solid 3px ${theme.palette.primary.main}`,
  borderRadius: '1rem',
  [`& .${classes.descriptionText}`]: {
    maxWidth: '200px',
    textAlign: 'center',
    margin: '0 auto',
  },
}))

const ShrinkageTable = ({ data = [], date = '' }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const shrinkageData = data.filter(item => item?.date === date)
  const paginatedRows = shrinkageData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
              <T color="primary.main" fontWeight="bold">
                Product
              </T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">
                Amount
              </T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">
                Description
              </T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">
                Expiration Date
              </T>
            </TableCell>
            <TableCell align="center">
              <T color="primary.main" fontWeight="bold">
                Date of Generation
              </T>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row?.productName}</TableCell>
              <TableCell align="center">{row?.amount}</TableCell>
              <TableCell align="center">
                <Tooltip
                  title={row?.description || ''}
                  arrow
                  placement="top"
                  slotProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: theme => theme.palette.contrast.main,
                        color: theme => theme.palette.background.main,
                      },
                    },
                  }}
                >
                  <T noWrap className={classes.descriptionText}>
                    {row?.description}
                  </T>
                </Tooltip>
              </TableCell>
              <TableCell align="center">{row?.expirationDate}</TableCell>
              <TableCell align="center">{row?.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.length}
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

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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  TableSortLabel,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'
import Image from 'next/image'
import { notPhoto } from '~/app/UI/Images'
import { useState, useMemo, useCallback } from 'react'
import EmptyState from '~/app/UI/Shared/EmptyState'
import { SentimentDissatisfied } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'

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
  [`& .${classes.imageContainer}`]: {
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  [`& .${classes.dialogImage}`]: {
    width: '100%',
    height: 'auto',
    maxHeight: '80vh',
    objectFit: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.closeButton}`]: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
    background: theme.palette.background.main,
    '&:hover': {
      background: theme.palette.background.main,
    },
  },
  [`& .${classes.dialogContent}`]: {
    position: 'relative',
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.imageWrapper}`]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  [`& .${classes.productImage}`]: {
    borderRadius: '4px',
  },
  [`& .${classes.sortLabel}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}))

const InventoryTable = ({
  data = [], search = '',
  setSelectedProduct,
  setOpenModalEditProduct,
  setOpenModalAdjustment
}) => {
  const [menuAnchorEl, setAnchorEl] = useState(null)
  const [imageDialog, setImageDialog] = useState({
    open: false,
    src: '',
    alt: ''
  })

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(row)
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleImageClick = (src, alt) => {
    setImageDialog({
      open: true,
      src: src || notPhoto,
      alt: alt || 'Product image'
    })
  }

  const handleCloseDialog = () => {
    setImageDialog({
      ...imageDialog,
      open: false
    })
  }

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const compareValues = useCallback((a, b, orderBy) => {
    if (orderBy === 'price' || orderBy === 'totalStock') {
      return (a[orderBy] - b[orderBy]) * (order === 'asc' ? 1 : -1)
    }
    if (!a[orderBy]) return 1
    if (!b[orderBy]) return -1
    return ('' + a[orderBy]).localeCompare(b[orderBy], undefined, {
      numeric: true,
      sensitivity: 'base'
    }) * (order === 'asc' ? 1 : -1)
  }, [order])

  const filteredData = useMemo(() => {
    return data?.filter(item => {
      const searchLower = search?.toLowerCase() || ''
      return (
        item?.name?.toLowerCase().includes(searchLower)
        || item?.SKU?.toLowerCase().includes(searchLower)
      )
    }) || []
  }, [data, search])

  const formattedData = useMemo(() => {
    return filteredData.map(product => {
      const totalStock = product.lots?.reduce((sum, lot) => {
        return sum + (lot.currentAmount || 0)
      }, 0) || 0
      return {
        ...product,
        totalStock
      }
    })
  }, [filteredData])

  const sortedData = useMemo(() => {
    return [...formattedData].sort((a, b) => compareValues(a, b, orderBy))
  }, [formattedData, compareValues, orderBy])

  const paginatedRows = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <EmptyState
        icon={<SentimentDissatisfied className={classes.emptyIcon} />}
        title="No Inventory Data"
        description="There are no products available in the inventory."
      />
    )
  }

  const SortableColumnHeader = ({ id, label }) => (
    <TableCell align="center">
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : 'asc'}
        onClick={() => handleRequestSort(id)}
        className={classes.sortLabel}
      >
        <T color="primary.main" fontWeight="bold">{label}</T>
      </TableSortLabel>
    </TableCell>
  )

  return (
    <Container>
      <TableContainer className={classes.TableContainer} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <SortableColumnHeader id="SKU" label="SKU" />
              <SortableColumnHeader id="name" label="Product" />
              <TableCell align="center"><T color="primary.main" fontWeight="bold">Image</T></TableCell>
              <SortableColumnHeader id="unit" label="Unit" />
              <SortableColumnHeader id="totalStock" label="Stock" />
              <SortableColumnHeader id="price" label="Price" />
              <TableCell align="center"><T color="primary.main" fontWeight="bold"></T></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row?.SKU}</TableCell>
                <TableCell align="center">{row?.name}</TableCell>
                <TableCell align="center">
                  <div
                    className={classes.imageContainer}
                    onClick={() => handleImageClick(row?.imageUrl, row?.name)}
                  >
                    <Image
                      src={row?.imageUrl || notPhoto}
                      alt={row?.name || ''}
                      width={70}
                      height={70}
                      className={classes.productImage}
                    />
                  </div>
                </TableCell>
                <TableCell align="center">{row?.unit}</TableCell>
                <TableCell align="center">{row?.totalStock}</TableCell>
                <TableCell align="center">${row?.price}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={event => handleMenuOpen(event, row)}>
                    <MoreVertIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Products per page"
        />
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            setOpenModalEditProduct(true)
            handleMenuClose()
          }}>Edit</MenuItem>
          <MenuItem onClick={() => {
            setOpenModalAdjustment(true)
            handleMenuClose()
          }}>Delete</MenuItem>
          <MenuItem onClick={() => {
            setOpenModalAdjustment(true)
            handleMenuClose()
          }}>Adjustment</MenuItem>
        </Menu>
      </TableContainer>
      <Dialog
        open={imageDialog.open}
        onClose={handleCloseDialog}
      >
        <DialogContent className={classes.dialogContent}>
          <IconButton
            className={classes.closeButton}
            onClick={handleCloseDialog}
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.imageWrapper}>
            <Image
              src={imageDialog.src}
              alt={imageDialog.alt}
              width={500}
              height={500}
              className={classes.dialogImage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default InventoryTable
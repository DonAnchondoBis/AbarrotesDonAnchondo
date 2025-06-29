'use client'
import { useState, useEffect, useCallback } from 'react'

import { styled } from '@mui/material/styles'

import { Typography as T, 
  TextField, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Button, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import getClassPrefixer from '~/app/UI/classPrefixer'
import apiFetch from '~/app/Lib/apiFetch'
import Loading from '~/app/UI/Shared/Loading'

import { useToken } from '~/app/store/useToken'

import Image from 'next/image'
import { notPhoto } from '~/app/UI/Images'

const displayName = 'PointOfSale'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding: '1rem',
  display: 'flex',
  height: 'calc(100vh - 4rem)',
  gap: '1rem',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    height: 'auto',
  },

  [`& .${classes.mainContent}`]: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '1rem',
    overflow: 'hidden',
  },

  [`& .${classes.searchContainer}`]: {
    width: '100%',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },

  [`& .${classes.searchTypeSelector}`]: {
    minWidth: '120px',
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.main,
      borderRadius: '50px',
      height: '40px',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },

  [`& .${classes.searchIcon} .MuiInputBase-root`]: {
    color: theme.palette.background.main,
    '&:hover': {
      color: theme.palette.background.main, 
    },
  },


  [`& .${classes.textFieldStyled}`]: {
    background: theme.palette.primary.main,
    '& .MuiInputLabel-outlined': {
      backgroundColor: theme.palette.background.main,
      color: theme.palette.primary.main,
      border : `1px solid ${theme.palette.primary.main}`,
      borderRadius: '2rem',
      padding: '0 1rem',
      marginLeft: '-4px',
    },
    '& .MuiOutlinedInput-root': {
      color: theme.palette.background.main,
      paddingLeft: '8px',
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.background.main,
    },
    '& .MuiInputBase-input': {
      color: theme.palette.background.main,
    },
  },

  [`& .${classes.productsGridContainer}`]: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },

  [`& .${classes.productsGrid}`]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
    padding: '0.5rem 0',
  },

  [`& .${classes.productCard}`]: {
    display: 'flex',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.main,
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },

  [`& .${classes.productImage}`]: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '12px',
  },

  [`& .${classes.salesSection}`]: {
    width: '420px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '12px',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      width: '100%',
      minWidth: 'auto',
    },
  },

  [`& .${classes.salesHeader}`]: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.palette.background.main}`,
    color: theme.palette.background.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.salesContent}`]: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '12px',
  },

  [`& .${classes.productsList}`]: {
    flex: 1,
    margin: '1rem',
    borderRadius: '12px',
    overflowY: 'auto',
    padding: '0 1rem',
    backgroundColor: theme.palette.background.main,
  },

  [`& .${classes.salesTable}`]: {
    width: '100%',
    tableLayout: 'fixed', // Evita que las celdas se expandan demasiado
    display: 'table', // Fuerza el comportamiento de tabla tradicional
  },

  [`& .${classes.salesTable} .MuiTableCell-root`]: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.text.primary,
    padding: '0.5rem',
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '@media (max-width: 600px)': {
      padding: '0.25rem',
      fontSize: '0.75rem',
    },
  },

  [`& .${classes.salesTable} .MuiTableCell-root:first-of-type`]: {
    width: '120px', // Ancho fijo para la columna de acciones
    '@media (max-width: 600px)': {
      width: '100px',
    },
  },

  [`& .${classes.salesTable} .MuiTableCell-root:nth-of-type(2)`]: {
    maxWidth: '150px', // Limita el ancho del nombre del producto
    '@media (max-width: 600px)': {
      maxWidth: '100px',
    },
  },

  [`& .${classes.salesTable} .MuiTableCell-root:last-of-type`]: {
    width: '80px', // Ancho fijo para la columna de precio
    textAlign: 'right',
    '@media (max-width: 600px)': {
      width: '60px',
    },
  },

  [`& .${classes.buttonDeleteProducts}`]: {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.background.main,
    width: '28px',
    height: '28px',
    minWidth: '28px',
    minHeight: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    fontSize: '1.1rem',
    lineHeight: 1,
    '&:hover': {
      backgroundColor: theme.palette.red.main,
    },
  },

  [`& .${classes.totalSection}`]: {
    padding: '1rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    borderRadius: '12px',
    backgroundColor: theme.palette.background.main,
  },

  [`& .${classes.containerButtons}`]: {
    display: 'grid',
    gridTemplateColumns: 'auto 4fr',
    padding: '1rem',

  },

  [`& .${classes.buttonDelete}`]: {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.background.main,
    borderRadius: '50%',
    marginRight: '1rem',
    '&:hover': {
      backgroundColor: theme.palette.red.dark,
    },
    '&.Mui-disabled': { 
      backgroundColor: theme.palette.primary.dark, 
    },
  },

  [`& .${classes.buttonDeleteDisabled}`]: {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.background.main,
    borderRadius: '50%',
    marginRight: '1rem',
  },

  [`& .${classes.buttonSaleDisabled}`]: {
    fontWeight: 'bold',
    borderRadius: '50px',
    '&:hover': {
      backgroundColor: theme.palette.green.dark,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.background.main,
    },
  },

  [`& .${classes.productActions}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },


  [`& .${classes.buttonRemoveOne}`]: {
    minWidth: '24px',
    width: '24px',
    height: '24px',
    padding: '6px',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },

  [`& .${classes.buttonRemoveAll}`]: {
    minWidth: '24px',
    width: '24px',
    height: '24px',
    padding: '6px',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },

  [`& .${classes.quantityBadge}`]: {
    minWidth: '24px',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '12px',
    padding: '2px 6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    margin: '0 4px',
  },

  [`& .${classes.buttonSale}`]: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.background.main,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: '50px',
  }

  
}))



const PointOfSale = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [openModal, setOpenModal] = useState(false)
  const [openStockErrorModal, setOpenStockErrorModal] = useState(false)
  const [stockErrors, setStockErrors] = useState([])
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useToken()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiFetch({
        method: 'GET',
        url: '/api/product',
        token
      })
      setProducts(Array.isArray(result) ? result : result.data || result.products || [])
    } catch (error) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchProducts()
  }, [token, fetchProducts])

  

  const ensureNumber = value => {
    if (typeof value === 'string') {
      return parseFloat(value)
    }
    return value
  }

  const total = cart.reduce((sum, item) => sum + (item.quantity * ensureNumber(item.price)), 0)

  const handleAddToCart = product => {
    const productWithNumberPrice = {
      ...product,
      price: ensureNumber(product.price)
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productWithNumberPrice.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productWithNumberPrice.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...productWithNumberPrice, quantity: 1 }]
      }
    })
  }

  const handleRemoveAllFromCart = indexToRemove => {
    setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove))
  }

  const handleRemoveFromCart = indexToRemove => {
    setCart(prevCart => {
      return prevCart.flatMap((item, index) => {
        if (index !== indexToRemove) return [item]
        if (item.quantity > 1) {
          return [{ ...item, quantity: item.quantity - 1 }]
        }
        return []
      })
    })
  }

  const handleSale = async () => {
    if (cart.length === 0) return

    const stockValidationErrors = []
    setLoading(true)
    for (const cartItem of cart) {
      const product = products.find(p => p.id === cartItem.id)
      if (product) {
        const totalStock = product.lots?.reduce((sum, lot) => sum + (lot.currentAmount || 0), 0) || 0
        if (cartItem.quantity > totalStock) {
          stockValidationErrors.push({
            productName: product.name,
            requested: cartItem.quantity,
            available: totalStock
          })
        }
      }
    }

    if (stockValidationErrors.length > 0) {
      setStockErrors(stockValidationErrors)
      setOpenStockErrorModal(true)
      setLoading(false)
      return
    }

    const salePayload = {
      products: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      total
    }
    
    try {
      await apiFetch({
        method: 'POST',
        url: '/api/ticket',
        payload: salePayload,
        token
      })
      setOpenModal(true)
      setCart([])
      fetchProducts()
    } catch (err) {
      alert('Error completing sale')
      console.error(err)
    }
    setLoading(false)
  }

  const filteredProducts = products.filter(product => {
    const totalStock = product.lots?.reduce((sum, lot) => sum + (lot.currentAmount || 0), 0) || 0
    if (totalStock === 0) return false
    
    const searchValue = searchTerm.toLowerCase()
    if (searchType === 'name') {
      return product.name?.toLowerCase().includes(searchValue)
    } else if (searchType === 'SKU') {
      return product.SKU?.toLowerCase().includes(searchValue)
    }
    return true
  })


  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={classes.mainContent}>
            <div className={classes.searchContainer}>
              <FormControl className={classes.searchTypeSelector}>
                <Select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="SKU">SKU</MenuItem>
                </Select>
              </FormControl>
              <TextField
                placeholder="Search Products"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={classes.textFieldStyled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className={classes.productsGridContainer}>
              <div className={classes.productsGrid}>
                {filteredProducts.map(product => (
                  <Paper
                    key={product.id}
                    className={classes.productCard}
                    elevation={2}
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className={classes.productImage}>
                      <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                        <Image
                          src={product?.imageUrl || notPhoto}
                          alt={product.name}
                          fill
                          style={{
                            objectFit: 'contain',
                            borderRadius: '12px',
                            background: '#fff'
                          }}
                        />
                      </div>
                    </div>
                    <T variant="subtitle2">{product.name}</T>
                    <T variant="body2">${product.price}</T>
                  </Paper>
                ))}
              </div>
            </div>
          </div>

          <Paper className={classes.salesSection} elevation={3}>
            <div className={classes.salesHeader}>
              <T variant="h6">Ticket</T>
            </div>

            <div className={classes.salesContent}>
              <div className={classes.productsList}>
                <Table className={classes.salesTable}>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className={classes.productActions}>
                            <IconButton
                              className={classes.buttonRemoveOne}
                              aria-label="Remove one item"
                              onClick={() => handleRemoveFromCart(index)}
                              size="small"
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                
                            <span className={classes.quantityBadge}>
                              {item.quantity}
                            </span>
                
                            <IconButton
                              className={classes.buttonRemoveAll}
                              aria-label="Remove all items"
                              onClick={() => handleRemoveAllFromCart(index)}
                              size="small"
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell>
                          <T variant="body2" noWrap>{item.name}</T>
                        </TableCell>
                        <TableCell align="right">
                          <T variant="body2">${ensureNumber(item.price).toFixed(2)}</T>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className={classes.totalSection}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <T variant="subtitle1" style={{ fontWeight: 'bold' }}>Total</T>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <T variant="subtitle1" style={{ fontWeight: 'bold' }}>
                          ${total.toFixed(2)}
                        </T>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className={classes.containerButtons}>
                <IconButton
                  className={cart.length === 0 ? classes.buttonDelete : classes.buttonDeleteDisabled}
                  aria-label="delete"
                  disabled={cart.length === 0} 
                  variant="outlined"
                  onClick={() => setCart([])}
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  className={cart.length === 0 ? classes.buttonSaleDisabled : classes.buttonSale}
                  variant="contained"
                  disabled={cart.length === 0}
                  fullWidth
                  onClick={handleSale}
                >
                  Sell Products
                </Button>
              </div>
            </div>
          </Paper>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            classes={{ paper: classes.dialog }}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'background.main',
                color: 'primary.main',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center'
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 'bold', color: 'inherit' }}>
            successful sale
            </DialogTitle>
            <DialogContent>
              <T variant="body1" sx={{ color: 'inherit' }}>
              The sale was completed successfully.
              </T>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="green"
                onClick={() => setOpenModal(false)}
                sx={{
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  color: 'background.main',
                  px: 4
                }}
              >
              OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openStockErrorModal}
            onClose={() => setOpenStockErrorModal(false)}
            classes={{ paper: classes.dialog }}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'background.main',
                color: 'red.main',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                maxWidth: '500px'
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 'bold', color: 'red.main' }}>
              Insufficient Stock
            </DialogTitle>
            <DialogContent>
              <T variant="body1" sx={{ color: 'primary.main', mb: 2 }}>
                The following products don&apos;t have enough stock:
              </T>
              {stockErrors.map((error, index) => (
                <T key={index} variant="body2" sx={{ color: 'primary.main', display: 'block', mb: 1 }}>
                  <strong>{error.productName}:</strong> Requested {error.requested}, Available {error.available}
                </T>
              ))}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenStockErrorModal(false)}
                sx={{
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  color: 'background.main',
                  px: 4
                }}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  )
}

const Wrapper = () => {
  return <PointOfSale />
}

export default Wrapper
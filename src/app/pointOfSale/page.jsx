'use client'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Typography as T, TextField, Paper, Table, TableBody, TableCell, TableRow, Button, IconButton, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'
import apiFetch from '~/app/Lib/apiFetch' // <--- IMPORTANTE
import { useToken } from '~/app/store/useToken'

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
    padding: '0.5rem 0',
  },

  [`& .${classes.textFieldStyled} .MuiInputBase-root`]: {
    backgroundColor: theme.palette.contrast.main,
    borderRadius: '50px',
    '&:hover': {
      backgroundColor: theme.palette.contrast.dark,
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
    backgroundColor: theme.palette.contrast.main,
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    cursor: 'pointer',
    height: '252px',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },

  [`& .${classes.productImage}`]: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.main,
    borderRadius: '12px',
  },

  [`& .${classes.salesSection}`]: {
    width: '320px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.contrast.main,
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
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.salesContent}`]: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.contrast.main,
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

  [`& .${classes.salesTable} .MuiTableCell-root`]: {
    borderBottom: `1px solid ${theme.palette.text.main}`,
    color: theme.palette.text.primary,
    padding: '0.5rem',
  },

  [`& .${classes.totalSection}`]: {
    padding: '1rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    borderRadius: '12px',
    backgroundColor: theme.palette.background.main,
    boxShadow: `0 2px 4px ${theme.palette.text.main}`,
  },

  [`& .${classes.containerButtons}`]: {
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: '1fr 5fr',
    justifyContent: 'space-between',
    padding: '1rem',
    borderTop: `1px solid ${theme.palette.primary.main}`,
  },

  [`& .${classes.buttonDelete}`]: {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.text.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: '50px',
    minWidth: '24px',
    width: '24px',
    height: '24px',
    padding: '0',
    marginRight: '1rem',
  },

  [`& .${classes.buttonSale}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: '50px',
  },
}))



const PointOfSale = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const { token } = useToken()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await apiFetch({
          method: 'GET',
          url: '/api/product',
          token
        })
        console.log(result)
        setProducts(Array.isArray(result) ? result : result.data || result.products || [])
      } catch (error) {
        setProducts([])
      }
      
    }
    fetchProducts()
  }, [])

  

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

  const handleRemoveFromCart = productId => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <Container>
      <div className={classes.mainContent}>
        <div className={classes.searchContainer}>
          <TextField
            label="Buscar productos"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="input-with-icon-textfield"
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
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        background: '#fff'
                      }}
                    />
                  )}
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
          <T variant="h6">Product List</T>
        </div>

        <div className={classes.salesContent}>
          <div className={classes.productsList}>
            <Table className={classes.salesTable}>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        className={classes.buttonDelete}
                        variant="contained"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        ×
                      </Button>
                      {item.quantity}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${ensureNumber(item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className={classes.totalSection}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    <T variant="subtitle1" style={{ fontWeight: 'bold' }}>Total</T>
                  </TableCell>
                  <TableCell align="right">
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
              className={classes.buttonDelete}
              aria-label="delete"
              variant="outlined"
              onClick={() => setCart([])}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              className={classes.buttonSale}
              variant="contained"
              onClick={() => alert('Sale completed!')}
            >
              Sale Products
            </IconButton>
          </div>
        </div>
      </Paper>
    </Container>
  )
}

const Wrapper = () => {
  const classes = getClassPrefixer('sales-page-wrapper')

  return (
    <div className={classes.wrapper}>
      <PointOfSale />
    </div>
  )
}

export default Wrapper
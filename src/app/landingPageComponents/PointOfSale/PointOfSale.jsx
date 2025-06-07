'use client'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Typography as T, TextField, Paper, Table, TableBody, TableCell, TableRow, Button, IconButton, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'PointOfSale'
const classes = getClassPrefixer(displayName)

const Container = styled('div')({
  padding: '1rem',
  display: 'flex',
  height: 'calc(100vh - 4rem)',
  gap: '1rem',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    height: 'auto',
  },
})

const MainContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '1rem',
  overflow: 'hidden',
})

const SearchContainer = styled('div')({
  width: '100%',
  padding: '0.5rem 0',
})

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.contrast.main,
    borderRadius: '50px',
    '&:hover': {
      backgroundColor: theme.palette.contrast.dark,
    },
  },
}))


const ProductsGridContainer = styled('div')({
  flex: 1,
  overflowY: 'auto',
  paddingRight: '0.5rem',
})

const ProductsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '1rem',
  padding: '0.5rem 0',
})

const ProductCard = styled(Paper)(({ theme }) => ({
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
}))

const ProductImage = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.main,
  borderRadius: '12px',
}))

const SalesSection = styled(Paper)(({ theme }) => ({
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
}))

const SalesHeader = styled('div')(({ theme }) => ({
  padding: '1rem',
  borderBottom: `1px solid ${theme.palette.background.main}`,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const SalesContent = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.contrast.main,
  borderRadius: '12px',
}))

const ProductsList = styled('div')(({ theme }) => ({
  flex: 1,
  margin: '1rem',
  borderRadius: '12px',
  overflowY: 'auto',
  padding: '0 1rem',
  backgroundColor: theme.palette.background.main,
}))

const XButton = styled(Button)(({ theme }) => ({
  minWidth: '24px',
  width: '24px',
  height: '24px',
  padding: '0',
  borderRadius: '50px',
  color: theme.palette.text.main,
  marginRight: '1rem',
  backgroundColor: theme.palette.red.main,
}))

const SalesTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.text.main}`,
    color: theme.palette.text.primary,
    padding: '0.5rem',
  },

}))

const TotalSection = styled('div')(({ theme }) => ({
  padding: '1rem',
  marginLeft: '1rem',
  marginRight: '1rem',
  borderRadius: '12px',
  backgroundColor: theme.palette.background.main,
  boxShadow: `0 2px 4px ${theme => theme.palette.text.main}`,
}))

const ContainerButtons = styled('div')({
  display: 'grid',
  gridGap: '1rem',
  gridTemplateColumns: '1fr 5fr',
  justifyContent: 'space-between',
  padding: '1rem',
  borderTop: `1px solid ${theme => theme.palette.primary.main}`,
})

const ButtonDelete = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.red.main,
  color: theme.palette.text.main,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: '50px',
}))

const ButtonSale = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.main,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: '50px',
}))

// Datos de ejemplo para los productos
// obtener desde endpoint de productos
const mockProducts = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Product ${String.fromCharCode(65 + (i % 26))}${i > 25 ? Math.floor(i / 26) : ''}`,
  price: 10 + (i % 15), // Ahora es número, no string
}))

const mockSales = [

  // Datos de ejemplo para el carrito de compras
  { id: 1, name: 'Product A', price: 10.00, quantity: 2 },
  { id: 2, name: 'Product B', price: 15.00, quantity: 1 },
  { id: 3, name: 'Product C', price: 20.00, quantity: 3 },
  { id: 4, name: 'Product D', price: 12.50, quantity: 1 },
  { id: 5, name: 'Product E', price: 8.99, quantity: 4 },
  { id: 6, name: 'Product F', price: 25.00, quantity: 2 },
  { id: 7, name: 'Product G', price: 18.50, quantity: 1 },
]

const PointOfSale = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState(mockSales)

  // Función para asegurar que el precio sea número
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

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container className={classes.container}>
      <MainContent>
        <SearchContainer>
          <TextFieldStyled
            label="Buscar productos"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="input-with-icon-textfield"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </SearchContainer>

        <ProductsGridContainer>
          <ProductsGrid>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                onClick={() => handleAddToCart(product)}
                elevation={2}
              >
                <ProductImage />
                <T variant="subtitle2">{product.name}</T>
                <T variant="body2">${product.price}</T>
              </ProductCard>
            ))}
          </ProductsGrid>
        </ProductsGridContainer>
      </MainContent>

      <SalesSection elevation={3}>
        <SalesHeader>
          <T variant="h6">Product List</T>
        </SalesHeader>

        <SalesContent>
          <ProductsList>
            <SalesTable>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <XButton variant="contained" onClick={() => handleRemoveFromCart(item.id)}>
                        ×
                      </XButton>
                      {item.quantity}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    {/* Aseguramos que price sea número antes de toFixed */}
                    <TableCell align="right">${ensureNumber(item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </SalesTable>
          </ProductsList>

          <TotalSection>
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
          </TotalSection>
          <ContainerButtons>
            <ButtonDelete aria-label="delete" variant="outlined" onClick={() => setCart([])}>
              <DeleteIcon />
            </ButtonDelete>
            <ButtonSale variant="contained" onClick={() => alert('Sale completed!')}>
              Sale Products
            </ButtonSale>
          </ContainerButtons>
        </SalesContent>
      </SalesSection>
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
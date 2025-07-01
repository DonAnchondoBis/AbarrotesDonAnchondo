'use client'

import {
  OutlinedInput,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
  Modal
} from '@mui/material'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'
import SearchIcon from '@mui/icons-material/Search'
import NotAvailable from '~/app/UI/Shared/NotAvailable'

import { useState, useEffect } from 'react'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import Loading from '~/app/UI/Shared/Loading'

import InventoryTable from './components/InventoryTable'
import AddProductModal from './components/AddProductModal'
import EditProductModal from './components/EditProductModal'
import AdjustmentModal from './components/AdjustmentModal'
import DeleteProductModal from '~/app/inventory/components/DeleteProductModal'

import AuthWrapper from '~/app/Lib/Permissions/AuthWrapper'

const displayName = 'InventoryPage'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem 8rem',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'center',
  '@media (max-width: 768px)': {
    padding: '1rem 2rem',
  },
  [`& .${classes.toolbar}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1ch'
  },
  [`& .${classes.searchGroup}`]: {
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.searchInput}`]: {
    minWidth: '150px',
    backgroundColor: theme.palette.contrast.main,
    borderRadius: '2rem',
    marginRight: '0.5rem',
    '& input::placeholder': {
      color: theme.palette.background.main,
      opacity: 0.7
    },
    '& .MuiInputBase-input': {
      color: theme.palette.background.main,
    }
  },
  [`& .${classes.button}`]: {
    color: theme.palette.background.main,
  },
  [`& .${classes.tableContainer}`]: {
    width: '100%',
    marginTop: '-0.5rem',
  },
}))

const InventoryPage = ({
  products,
  lots,
  searchProducts,
  handleSearchProducts,
  isLoading,
  openModalAddProduct,
  setOpenModalAddProduct,
  snackbarMessage,
  setSnackbarMessage,
  refresh,
  openModalEditProduct,
  setOpenModalEditProduct,
  selectedProduct,
  setSelectedProduct,
  openModalAdjustment,
  setOpenModalAdjustment,
  setModalOpenDeleteProduct,
  openModalDeleteProduct
}) => {
  return (
    <Container>
      <div className={classes.toolbar}>
        <Tabs
          value="inventory"
          onChange={() => {}}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Inventory" value="inventory" />
        </Tabs>
        <div className={classes.searchGroup}>
          <OutlinedInput
            className={classes.searchInput}
            placeholder="Search by name or SKU"
            size="small"
            value={searchProducts}
            onChange={handleSearchProducts}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color="background" />
              </InputAdornment>
            }
          />
          <Button
            variant='contained'
            color='green'
            className={classes.button}
            disabled={isLoading}
            onClick={() => setOpenModalAddProduct(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className={classes.tableContainer}>
        <InventoryTable
          data={products}
          search={searchProducts}
          lots={lots}
          setSelectedProduct={setSelectedProduct}
          setOpenModalEditProduct={setOpenModalEditProduct}
          setOpenModalAdjustment={setOpenModalAdjustment}
          setModalOpenDeleteProduct={setModalOpenDeleteProduct}
          selectedProduct={selectedProduct}
        />
      </div>
      <Modal
        open={openModalAddProduct}
        onClose={() => setOpenModalAddProduct(false)}
      >
        <AddProductModal
          onClose={() => setOpenModalAddProduct(false)}
          setSnackbarMessage={setSnackbarMessage}
          refresh={refresh}
        />
      </Modal>
      <Modal
        open={openModalEditProduct}
        onClose={() => setOpenModalEditProduct(false)}
      >
        <EditProductModal
          onClose={() => setOpenModalEditProduct(false)}
          setSnackbarMessage={setSnackbarMessage}
          refresh={refresh}
          selectedProduct={selectedProduct}
        />
      </Modal>
      <Modal
        open={openModalAdjustment}
        onClose={() => setOpenModalAdjustment(false)}
      >
        <AdjustmentModal
          onClose={() => setOpenModalAdjustment(false)}
          setSnackbarMessage={setSnackbarMessage}
          refresh={refresh}
          selectedProduct={selectedProduct}
        />
      </Modal>
      <Modal
        open={openModalDeleteProduct}
        onClose={() => setModalOpenDeleteProduct(false)}
      >
        <DeleteProductModal
          onClose={() => setModalOpenDeleteProduct(false)}
          setSnackbarMessage={setSnackbarMessage}
          refresh={refresh}
          selectedProduct={selectedProduct}
        />
      </Modal>
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={5000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbarMessage?.severity}
        >
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const Wrapper = () => {
  const { token } = useToken()
  const [isLoading, setIsLoading] = useState(true)
  const [searchProducts, setSearchProducts] = useState('')
  const [openModalAddProduct, setModalOpenAddProduct] = useState(false)
  const [openModalEditProduct, setModalOpenEditProduct] = useState(false)
  const [openModalAdjustment, setModalOpenAdjustment] = useState(false)
  const [openModalDeleteProduct, setModalOpenDeleteProduct] = useState(false)
  const [products, setProducts] = useState([])
  const [lots, setLots] = useState([])
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleSearchProducts = event => setSearchProducts(event.target.value)
  const refresh = async () => {
    const responseProducts = await apiFetch({ url: 'api/product', method: 'GET', token })
    const responseLots = await apiFetch({ url: 'api/lot', method: 'GET', token })
    const isForbidden = responseProducts.error === 'Not Allowed' && responseLots.error === 'Not Allowed'
    setProducts(responseProducts?.error ? [] : responseProducts)
    setLots(responseLots?.error ? [] : responseLots)
    setIsLoading(isForbidden)
  }

  useEffect(() => {
    setIsLoading(true)
    const getLotsSupppliersAndProducts = async () => {
      const responseProducts = await apiFetch({ url: 'api/product', method: 'GET', token })
      const responseLots = await apiFetch({ url: 'api/lot', method: 'GET', token })
      const isForbidden = responseProducts.error === 'Not Allowed' && responseLots.error === 'Not Allowed'
      setProducts(responseProducts?.error ? [] : responseProducts)
      setLots(responseLots?.error ? [] : responseLots)
      setIsLoading(isForbidden)
    }
    getLotsSupppliersAndProducts()
  }, [token])

  if (isLoading) return <Loading />
  
  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired='WAREHOUSE'>
      <InventoryPage
        products={products}
        lots={lots}
        isLoading={isLoading}
        searchProducts={searchProducts}
        handleSearchProducts={handleSearchProducts}
        modalOpenAddProduct={openModalAddProduct}
        openModalAddProduct={openModalAddProduct}
        setOpenModalAddProduct={setModalOpenAddProduct}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
        refresh={refresh}
        openModalEditProduct={openModalEditProduct}
        setOpenModalEditProduct={setModalOpenEditProduct}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        openModalAdjustment={openModalAdjustment}
        setOpenModalAdjustment={setModalOpenAdjustment}
        setModalOpenDeleteProduct={setModalOpenDeleteProduct}
        openModalDeleteProduct={openModalDeleteProduct}
      />
    </AuthWrapper>
  )
}

export default Wrapper
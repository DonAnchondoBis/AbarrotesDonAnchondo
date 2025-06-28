'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  Button,
  Modal,
  Snackbar,
  Alert
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

import { SentimentDissatisfied } from '@mui/icons-material'

import LotsTable from './LotsTable'
import SuppliersTable from './SuppliersTable'
import ModalAddLot from '~/app/acquisitions/ModalAddLot'
import ModalAddSupplier from '~/app/acquisitions/ModalAddSupplier'
import NotAvailable from '~/app/UI/Shared/NotAvailable'
import EmptyState from '~/app/UI/Shared/EmptyState'

import { useState, useEffect } from 'react'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import Loading from '~/app/UI/Shared/Loading'
import AuthWrapper from '~/app/Lib/Permissions/AuthWrapper'

const displayName = 'AcquisitionsPage'
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
  [`& .${classes.containerTools}`]: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    marginBottom: '1ch',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      justifyContent:  'flex-start',
    },
  },
  [`& .${classes.inputGroup}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1rem',
    '@media (max-width: 768px)': {
      marginTop: '1rem',
    },
  },
  [`& .${classes.searchInput}`]: {
    minWidth: '150px',
    marginLeft: '1rem',
    backgroundColor: theme.palette.contrast.main,
    borderRadius: '2rem',
    '& input::placeholder': {
      color: theme.palette.background.main,
      opacity: 0.7
    },
    '& .MuiInputBase-input': {
      color: theme.palette.background.main,
    }
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '1rem',
    color: theme.palette.background.main,
  },
  [`& .${classes.button}`]: {
    color: theme.palette.background.main,
  },
  [`& .${classes.tableContainer}`]: {
    width: '100%',
  },
}))

const AcquisitionsPage = ({
  selectedCategory,
  handleCategoryChange,
  searchLots,
  handleSearchLotsChange,
  searchSuppliers,
  handleSearchSuppliersChange,
  isLoading,
  suppliers,
  lots,
  setOpenModalAddLot,
  openModalAddLot,
  products,
  snackbarMessage,
  setSnackbarMessage,
  setOpenModalAddSupplier,
  openModalAddSupplier,
  fetchData
}) => {
  return (
    <Container>
      <div className={classes.containerTools}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Lots" value="lots" />
          <Tab label="Suppliers" value="suppliers" />
        </Tabs>
        <div className={classes.inputGroup}>
          <OutlinedInput
            className={classes.searchInput}
            placeholder="Search by name"
            size="small"
            value={selectedCategory === 'lots' ? searchLots : searchSuppliers}
            onChange={selectedCategory === 'lots' ? handleSearchLotsChange : handleSearchSuppliersChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color='background'/>
              </InputAdornment>
            }
          />
          { selectedCategory === 'lots'
            ? (
              <Button
                variant='contained'
                color='green'
                className={classes.button}
                disabled={isLoading}
                onClick={() => setOpenModalAddLot(true)}
              >
                Add Lot
              </Button>
            )
            : (
              <Button
                variant='contained'
                color='green'
                className={classes.button}
                disabled={isLoading}
                onClick={() => setOpenModalAddSupplier(true)}
              >
                Add Supplier
              </Button>
            )
          }
        </div>
      </div>
      <div className={classes.tableContainer}>
        {selectedCategory === 'lots'
        && (
          lots.length === 0 && !isLoading
            ? <EmptyState
              icon={<SentimentDissatisfied sx={{ fontSize: 100, color: theme => theme.palette.primary.main }} />}
              title="No Lots Data"
              description="There are no lots available."
            />
            : (<LotsTable search={searchLots} lots={lots} />)
        )
        }
        {selectedCategory === 'suppliers' && <SuppliersTable search={searchSuppliers} suppliers={suppliers} />}
      </div>
      { selectedCategory === 'lots'
        ? (
          <Modal
            open={openModalAddLot}
            onClose={() => setOpenModalAddLot(false)}
          >
            <ModalAddLot
              products={products}
              onClose={() => setOpenModalAddLot(false)}
              setSnackbarMessage={setSnackbarMessage}
              search={searchLots}
              fetchData={() => fetchData({ entity: 'lot' })}
            />
          </Modal>
        )
        : (
          <Modal
            open={openModalAddSupplier}
            onClose={() => setOpenModalAddSupplier(false)}
          >
            <ModalAddSupplier
              products={products}
              onClose={() => setOpenModalAddSupplier(false)}
              setSnackbarMessage={setSnackbarMessage}
              search={searchSuppliers}
              fetchData={() => fetchData({ entity: 'supplier' })}
            />
          </Modal>
        )
      }
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
  const [selectedCategory, setSelectedCategory] = useState('lots')
  const [searchSuppliers, setSearchSuppliers] = useState('')
  const [searchLots, setSearchLots] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [lots, setLots] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openModalAddLot, setOpenModalAddLot] = useState(false)
  const [openModalAddSupplier, setOpenModalAddSupplier] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const { token } = useToken()

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchSuChange = event => setSearchSuppliers(event.target.value)
  const handleSearchLotsChange = event => setSearchLots(event.target.value)

  const fetchData = async ({ entity }) => {
    setIsLoading(true)
    const response = await apiFetch({ url: `api/${entity}`, method: 'GET', token })
    if (response.error) {
      if (entity === 'supplier') setSuppliers([])
      if (entity === 'lot') setLots([])
      if (entity === 'product') setProducts([])
    } else {
      if (entity === 'supplier') setSuppliers(response)
      if (entity === 'lot') setLots(response)
      if (entity === 'product') setProducts(response)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    const getLotsSupppliersAndProducts = async () => {
      const responseSuppliers = await apiFetch({ url: 'api/supplier', method: 'GET', token })
      const responseLots = await apiFetch({ url: 'api/lot', method: 'GET', token })
      const responseProducts = await apiFetch({ url: 'api/product', method: 'GET', token })
      const isForbidden = responseSuppliers.error === 'Not Allowed' || responseLots.error === 'Not Allowed' || responseProducts.error === 'Not Allowed'

      setSuppliers(responseSuppliers?.error ? [] : responseSuppliers)
      setLots(responseLots?.error ? [] : responseLots)
      setProducts(responseProducts?.error ? [] : responseProducts)
      setIsLoading(isForbidden)
    }
    getLotsSupppliersAndProducts()
  }, [token])

  if (isLoading) return <Loading />

  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired='WAREHOUSE'>
      <AcquisitionsPage
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        searchLots={searchLots}
        handleSearchLotsChange={handleSearchLotsChange}
        searchSuppliers={searchSuppliers}
        handleSearchSuppliersChange={handleSearchSuChange}
        isLoading={isLoading}
        suppliers={suppliers}
        lots={lots}
        openModalAddLot={openModalAddLot}
        setOpenModalAddLot={setOpenModalAddLot}
        products={products}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
        openModalAddSupplier={openModalAddSupplier}
        setOpenModalAddSupplier={setOpenModalAddSupplier}
        fetchData={fetchData}
      />
    </AuthWrapper>
  )
}

export default Wrapper

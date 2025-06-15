'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

import LotsTable from './LotsTable'
import SuppliersTable from './SuppliersTable'
import ModalLots from './ModalLots'
import AuthWrapper from '~/app/Lib/Permissions/AuthWrapper'
import NotAvailable from '~/app/UI/Shared/NotAvailable'

import { useState, useEffect } from 'react'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import Loading from '~/app/UI/Shared/Loading'

const displayName = 'Competitors'
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
  },
  [`& .${classes.inputGroup}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1rem',
  },
  [`& .${classes.searchInput}`]: {
    minWidth: '200px',
    padding: '0 1rem',
    borderRadius: '2rem',
    backgroundColor: theme.palette.contrast.main,
    '& input::placeholder': {
      color: theme.palette.background.main,
      opacity: 0.7,
    },
    '& .MuiInputBase-input': {
      color: theme.palette.background.main,
    },
  },
[`& .${classes.button}`]: {
  border: `1.5px solid ${theme.palette.success.main}`, // borde verde
  padding: '0 1rem',
  height: '40px',
  boxSizing: 'border-box',
  '&.Mui-disabled, &:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.text.disabled,
    border: `1.5px solid ${theme.palette.grey[400]}`,
  },
},
   [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '1rem',
    color: theme.palette.background.main,
    height: '40px'
  },
  [`& .${classes.tableContainer}`]: {
    width: '100%',
  },
}))

const PublicTable = ({
  selectedCategory,
  handleCategoryChange,
  searchLots,
  handleSearchLotsChange,
  searchSuppliers,
  handleSearchSuppliersChange,
  isLoading,
  suppliers,
  lots,
}) => {

const [openModal, setOpenModal] = useState(false);

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
          placeholder="Search product"
          size="small"
          value={selectedCategory === 'lots' ? searchLots : searchSuppliers}
          onChange={selectedCategory === 'lots' ? handleSearchLotsChange : handleSearchSuppliersChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color='background'/>
            </InputAdornment>
          }
        />
        <Button
          className={classes.button}
          variant='contained'
          color='success'
          onClick={() => setOpenModal(true)}
        >
          ADD PRODUCT
        </Button>
      </div>
    </div>
    {isLoading
        ? (<Loading />) : (
          <div className={classes.tableContainer}>
          {selectedCategory === 'lots' && <LotsTable search={searchLots} lots={lots} />}
          {selectedCategory === 'suppliers' && <SuppliersTable search={searchSuppliers} suppliers={suppliers} />}
        </div>
        )}
     <ModalLots open={openModal} onClose={() => setOpenModal(false)} />
  </Container>
)
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('lots')
  const [searchSuppliers, setSearchSuppliers] = useState('')
  const [searchLots, setSearchLots] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [lots, setLots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useToken()

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchSuChange = (event) => setSearchSuppliers(event.target.value)
  const handleSearchLotsChange = (event) => setSearchLots(event.target.value)

  useEffect(() => {
    setIsLoading(true)
    const getLotsAndSupppliers = async () => {
      const responseSuppliers = await apiFetch({ url: 'api/supplier', method: 'GET', token })
      const responseLots = await apiFetch({ url: 'api/lot', method: 'GET', token })
      if (responseSuppliers.error && responseLots.error) {
        setSuppliers([])
        setLots([])
      } else {
        setSuppliers(responseSuppliers)
        setLots(responseLots)
      }
      setIsLoading(false)
    }
    getLotsAndSupppliers()
  }, [token])

  return (
    <PublicTable
      selectedCategory={selectedCategory}
      handleCategoryChange={handleCategoryChange}
      searchLots={searchLots}
      handleSearchLotsChange={handleSearchLotsChange}
      searchSuppliers={searchSuppliers}
      handleSearchSuppliersChange={handleSearchSuChange}
      isLoading={isLoading}
      suppliers={suppliers}
      lots={lots}
    />
  )
}

export default Wrapper

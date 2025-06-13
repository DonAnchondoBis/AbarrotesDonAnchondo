'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  TextField,
  Typography as T,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

import InventoryTable from './InventoryTable'
import ShrinkageTable from './ShrinkageTable'
import SalesOfTheDayTable from './SalesOfTheDayTable'

import { useEffect, useState } from 'react'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'
import Loading from '~/app/UI/Shared/Loading'

import AuthWrapper from '~/app/Lib/Permissions/AuthWrapper'
import NotAvailable from '~/app/UI/Shared/NotAvailable'

const displayName = 'ReportsPage'
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    marginBottom: '1ch',
    justifyContent: 'space-between',
    '@media  (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  [`& .${classes.tableContainer}`]: {
    width: '100%',
  },
  [`& .${classes.tabs}`]: {
    width: '100%',
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
  [`& .${classes.dateInput}`]: {
    minWidth: '200px',
    minHeight: '40px',
    '@media  (max-width: 768px)': {
      marginTop: '1rem',
    },
    backgroundColor: theme.palette.contrast.main,
    '& .MuiInputBase-input': {
      color: theme.palette.background.main,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.background.main,
      opacity: 0.7
    },
  },
}))

const ReportsPage = ({
  selectedCategory,
  handleCategoryChange,
  search,
  handleSearchChange,
  shrinkage,
  isLoading,
  selectedDateShrinkage,
  handleDateChangeShrinkage,
  selectedDateSalesday,
  handleDateChangeSalesday,
  error
}) => {
  return (
    <Container>
      <div className={classes.containerTools}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          className={classes.tabs}
        >
          <Tab label="Inventory" value="inventory" />
          <Tab label="Shrinkage" value="shrinkage" />
          <Tab label="Sales of the day" value="salesday" />
        </Tabs>
        {selectedCategory === 'inventory' && !error && (
          <OutlinedInput
            className={classes.searchInput}
            placeholder="Search by name"
            size="small"
            value={search}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color='background'/>
              </InputAdornment>
            }
          />
        )}
        {selectedCategory === 'shrinkage' && (
          <TextField
            variant="filled"
            name="date"
            label="Seleccionar fecha"
            type="date"
            value={selectedDateShrinkage ?? ''}
            onChange={handleDateChangeShrinkage}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.dateInput}
          />
        )}
        {selectedCategory === 'salesday' && (
          <TextField
            variant="filled"
            name="date"
            label="Seleccionar fecha"
            type="date"
            value={selectedDateSalesday ?? ''}
            onChange={handleDateChangeSalesday}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.dateInput}
          />
        )}
      </div>
      {isLoading
        ? (<Loading />)
        : (
          <div className={classes.tableContainer}>
            {selectedCategory === 'inventory' && !error && <InventoryTable search={search} />}
            {selectedCategory === 'shrinkage' && !error && selectedDateShrinkage && <ShrinkageTable data={shrinkage} date={selectedDateShrinkage} />}
            {selectedCategory === 'salesday' && !error && selectedDateSalesday && <SalesOfTheDayTable search={search} />}
            {error && (
              <T color="error" variant="h6">
                Sorry there was an error, please try again later.
              </T>
            )}
            {(!selectedDateSalesday) && (selectedCategory === 'salesday') && (
              <T variant="h6">
                Select a date, please.
              </T>
            )}
            {(!selectedDateShrinkage) && (selectedCategory === 'shrinkage') && (
              <T variant="h6">
                Select a date, please.
              </T>
            )}
          </div>
        )
      }
    </Container>
  )
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('inventory')
  const [selectedDateShrinkage, setSelectedDateShrinkage] = useState(null)
  const [selectedDateSalesday, setSelectedDateSalesday] = useState(null)
  const [error, setError] = useState(false)
  const [shrinkage, setShrinkage] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useToken()

  const handleDateChangeShrinkage = event => setSelectedDateShrinkage(event.target.value)
  const handleDateChangeSalesday = event => setSelectedDateSalesday(event.target.value)
  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = event => setSearch(event.target.value)

  useEffect(() => {
    setIsLoading(true)
    const getShrinkage = async () => {
      const response = await apiFetch({ url: 'api/inventoryLog?type=SHRINKAGE', method: 'GET', token })
      if (response.error && response.error !== 'Not allowed') {
        setError(true)
        setShrinkage([])
      } else {
        setError(false)
        setShrinkage(response)
      }
      setIsLoading(false)
    }
    getShrinkage()
  }, [token])

  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired='ADMIN'>
      <ReportsPage
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        search={search}
        handleSearchChange={handleSearchChange}
        shrinkage={shrinkage}
        isLoading={isLoading}
        error={error}
        selectedDateShrinkage={selectedDateShrinkage}
        handleDateChangeShrinkage={handleDateChangeShrinkage}
        selectedDateSalesday={selectedDateSalesday}
        handleDateChangeSalesday={handleDateChangeSalesday}
      />
    </AuthWrapper>
  )
}

export default Wrapper

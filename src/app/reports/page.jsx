'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

import EmptyState from '~/app/UI/Shared/EmptyState'

import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'

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
    '@media  (max-width: 768px)': {
      marginTop: '1rem',
      marginLeft: '0',
    },
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
  salesday,
  inventory,
  selectedDateShrinkage,
  handleDateChangeShrinkage,
  selectedDateSalesday,
  handleDateChangeSalesday,
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
        {selectedCategory === 'inventory' && (
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
      <div className={classes.tableContainer}>
        {selectedCategory === 'inventory' && <InventoryTable data={inventory} search={search} />}
        {selectedCategory === 'shrinkage' && selectedDateShrinkage && <ShrinkageTable data={shrinkage} date={selectedDateShrinkage} />}
        {selectedCategory === 'salesday' && selectedDateSalesday && <SalesOfTheDayTable data={salesday} date={selectedDateSalesday} />}
        {(!selectedDateSalesday) && (selectedCategory === 'salesday') && (
          <EmptyState
            icon={<CalendarMonthTwoToneIcon sx={{ fontSize: 100, color: theme => theme.palette.primary.main }} />}
            title="Welcome to Sales of the Day."
            subtitle="Please choose a date to start."
          />
        )}
        {(!selectedDateShrinkage) && (selectedCategory === 'shrinkage') && (
          <EmptyState
            icon={<CalendarMonthTwoToneIcon sx={{ fontSize: 100, color: theme => theme.palette.primary.main }} />}
            title="Welcome to Shrinkage."
            subtitle="Please choose a date to start."
          />
        )}
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('inventory')
  const [selectedDateShrinkage, setSelectedDateShrinkage] = useState(null)
  const [selectedDateSalesday, setSelectedDateSalesday] = useState(null)
  const [shrinkage, setShrinkage] = useState([])
  const [salesday, setSalesday] = useState([])
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useToken()

  const handleDateChangeShrinkage = event => setSelectedDateShrinkage(event.target.value)
  const handleDateChangeSalesday = event => setSelectedDateSalesday(event.target.value)
  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = event => setSearch(event.target.value)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const [inventoryData, shrinkageData, salesdayData] = await Promise.all([
        apiFetch({ url: 'api/lot', method: 'GET', token }),
        apiFetch({ url: 'api/inventoryLog?type=SHRINKAGE', method: 'GET', token }),
        apiFetch({ url: 'api/ticket', method: 'GET', token })
      ])
      const isForbidden = inventoryData?.error === 'Not Allowed' && salesdayData?.error === 'Not Allowed' && shrinkageData?.error === 'Not Allowed'
      setInventory(inventoryData?.error ? [] : inventoryData)
      setSalesday(salesdayData?.error ? [] : salesdayData)
      setShrinkage(shrinkageData?.error ? [] : shrinkageData)
      setIsLoading(isForbidden)
    }
    fetchData()

  }, [token])

  if (isLoading) return <Loading />
  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired='ADMIN'>
      <ReportsPage
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        search={search}
        handleSearchChange={handleSearchChange}
        shrinkage={shrinkage}
        salesday={salesday}
        inventory={inventory}
        isLoading={isLoading}
        selectedDateShrinkage={selectedDateShrinkage}
        handleDateChangeShrinkage={handleDateChangeShrinkage}
        selectedDateSalesday={selectedDateSalesday}
        handleDateChangeSalesday={handleDateChangeSalesday}
      />
    </AuthWrapper>
  )
}

export default Wrapper

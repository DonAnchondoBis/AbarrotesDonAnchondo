'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
} from '@mui/material'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'
import InventoryTable from './InventoryTable'
import ShrinkageTable from './ShrinkageTable'
import SalesOfTheDayTable from './SaleDay'

const displayName = 'Competitors'
const classes = getClassPrefixer(displayName)
const Container = styled('div')(() => ({
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
  [`& .${classes.tableContainer}`]: {
    width: '100%',
  },
  [`& .${classes.searchInput}`]: {
    minWidth: '250px',
    marginLeft: '1rem',
  },
}))

const PublicTable = ({
  selectedCategory,
  handleCategoryChange,
  search,
  handleSearchChange,
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
          <Tab label="Inventory" value="inventory" />
          <Tab label="Shrinkage" value="shrinkage" />
          <Tab label="Sales of the day" value="salesday" />
        </Tabs>
        <OutlinedInput
          className={classes.searchInput}
          placeholder="Buscar por nombre"
          size="small"
          value={search}
          onChange={handleSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      <div className={classes.tableContainer}>
        {selectedCategory === 'inventory' && <InventoryTable search={search} />}
        {selectedCategory === 'shrinkage' && <ShrinkageTable search={search} />}
        {selectedCategory === 'salesday' && <SalesOfTheDayTable search={search} />}
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('inventory')
  const [search, setSearch] = useState('')

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = event => setSearch(event.target.value)

  return (
    <PublicTable
      selectedCategory={selectedCategory}
      handleCategoryChange={handleCategoryChange}
      search={search}
      handleSearchChange={handleSearchChange}
      
    />  
  )
}

export default Wrapper
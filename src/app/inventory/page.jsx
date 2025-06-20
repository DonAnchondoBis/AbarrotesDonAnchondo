'use client'

import {
  OutlinedInput,
  InputAdornment
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'

import InventoryTable from './components/InventoryTable'
import AddProductButton from './components/AddProductButton'
import EditProductModal from './components/EditProductModal'

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
  '& .toolbar': {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    gap: 0
  },
  '& .searchInput': {
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
  '& .tableContainer': {
    width: '100%',
  },
}))

const InventoryPage = () => {
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const handleAddProduct = (newProduct) => {
    setInventory(prev => [...prev, newProduct])
    setModalOpen(false)
  }

  return (
    <Container>
      <div className="toolbar">
        <OutlinedInput
          className="searchInput"
          placeholder="Search by name"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color="background" />
            </InputAdornment>
          }
        />
        <AddProductButton onClick={() => setModalOpen(true)} />
      </div>

      <div className="tableContainer">
        <InventoryTable data={inventory} search={search} />
      </div>

      <EditProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isNew={true}
        onSave={handleAddProduct}
      />
    </Container>
  )
}

export default InventoryPage

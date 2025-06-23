'use client'

import {
  OutlinedInput,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'

import InventoryTable from './components/InventoryTable'
import AddProductButton from './components/AddProductButton'
import EditProductModal from './components/EditProductModal'
import DeleteProductModal from './components/DeleteProductModal'
import WasteModal from './components/WasteModal'
import AdjustmentModal from './components/AdjustmentModal'
import getClassPrefixer from '~/app/UI/classPrefixer'

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
    gap: '1rem'
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
  [`& .${classes.tableContainer}`]: {
    width: '100%',
    marginTop: '-0.5rem',
  },
}))

const InventoryPage = () => {
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState('inventory')
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [wasteProduct, setWasteProduct] = useState(null)
  const [adjustProduct, setAdjustProduct] = useState(null)

  const handleAddProduct = (newProduct) => {
    setInventory(prev => [...prev, newProduct])
    setModalOpen(false)
  }

  const handleUpdateProduct = (updatedProduct) => {
    setInventory(prev => prev.map(p => p.sku === updatedProduct.sku ? updatedProduct : p))
    setEditProduct(null)
  }

  const handleDeleteProduct = () => {
    setInventory(prev => prev.filter(p => p.sku !== deleteProduct.sku))
    setDeleteProduct(null)
  }

  const handleAdjustStock = (newStock) => {
    setInventory(prev => prev.map(p => p.sku === adjustProduct.sku ? { ...p, stock: newStock } : p))
    setAdjustProduct(null)
  }

  return (
    <Container>
      <div className={classes.toolbar}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Inventory" value="inventory" />
        </Tabs>
        <div className={classes.searchGroup}>
          <OutlinedInput
            className={classes.searchInput}
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
      </div>

      <div className={classes.tableContainer}>
        <InventoryTable
          data={inventory}
          search={search}
          onEdit={setEditProduct}
          onDelete={setDeleteProduct}
          onWaste={setWasteProduct}
          onAdjust={setAdjustProduct}
        />
      </div>

      <EditProductModal
        open={modalOpen || Boolean(editProduct)}
        onClose={() => {
          setModalOpen(false)
          setEditProduct(null)
        }}
        isNew={!editProduct}
        product={editProduct}
        onSave={editProduct ? handleUpdateProduct : handleAddProduct}
      />

      <DeleteProductModal
        open={Boolean(deleteProduct)}
        onClose={() => setDeleteProduct(null)}
        onDelete={handleDeleteProduct}
      />

      <WasteModal
        open={Boolean(wasteProduct)}
        onClose={() => setWasteProduct(null)}
        onRegister={(waste) => {
          console.log('Waste registered:', waste)
          setWasteProduct(null)
        }}
      />

      <AdjustmentModal
        open={Boolean(adjustProduct)}
        onClose={() => setAdjustProduct(null)}
        product={adjustProduct}
        onAdjust={handleAdjustStock}
      />
    </Container>
  )
}

export default InventoryPage
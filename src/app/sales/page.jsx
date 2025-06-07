'use client'

import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Tabs, Tab, Box } from '@mui/material'
import { Search } from '@mui/icons-material'
import Table from './components/table' // Ajusta ruta según estructura
import MGoodReceipt from './components/MGoodReceipt'
import MSuppliers from './components/MSuppliers'


const classes = {
  action: 'action',
  actionOne: 'actionOne',
  actionTwo: 'actionTwo',
  searchWrapper: 'searchWrapper',
  searchInput: 'searchInput',
  searchIcon: 'searchIcon',
  btnAddP: 'btnAddP',
}

const Container = styled('div')(() => ({
  [`& .${classes.action}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '2rem 7rem 3.5rem',
  },
  [`& .${classes.actionOne}`]: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  [`& .${classes.actionTwo}`]: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  [`& .${classes.searchWrapper}`]: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.searchInput}`]: {
    padding: '0.8rem 3rem 0.8rem 1.75rem',
    borderRadius: '23px',
    border: '1px solid #ccc',
    fontSize: '15px',
    backgroundColor: '#D9C3AA',
  },
  [`& .${classes.searchIcon}`]: {
    position: 'absolute',
    right: '0.6rem',
    color: '#888',
    cursor: 'pointer',
  },
  [`& .${classes.btnAddP}`]: {
    color: 'white',
    backgroundColor: '#8FB25C',
    padding: '0.8rem 4rem',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '23px',
    fontSize: '15px',
    marginLeft: '20px',
  },
}))

const SalesPage = ({ goodsReceiptData = [], suppliersData = [] }) => {
  const [searchValue, setSearchValue] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // Aquí puedes manejar la búsqueda externa o filtrado al subir datos
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  // Aquí el filtrado se lo puedes hacer al recibir los datos si quieres
  // O dejar que Table filtre o muestre todo según el prop searchValue

  return (
    <Container>
      <div className={classes.action}>
        <div className={classes.actionOne}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Goods Receipt" />
            <Tab label="Suppliers" />
          </Tabs>
        </div>

        <div className={classes.actionTwo}>
          <form onSubmit={handleSearch} className={classes.searchWrapper}>
            <input
              type="text"
              placeholder="Search Product"
              className={classes.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className={classes.searchIcon} onClick={handleSearch} />
          </form>

          <button className={classes.btnAddP} onClick={() => setIsModalOpen(true)}>Add Product</button>
        </div>
      </div>

      <Box sx={{ mt: 4, px: 4 }}>
        {tabIndex === 0 && (
          <Table type="goodsReceipt" data={goodsReceiptData} searchValue={searchValue} />
        )}
        {tabIndex === 1 && (
          <Table type="suppliers" data={suppliersData} searchValue={searchValue} />
        )}
      </Box>

      {isModalOpen && (
      tabIndex === 0
        ? <MGoodReceipt onClose={() => setIsModalOpen(false)} />
        : <MSuppliers onClose={() => setIsModalOpen(false)} />
    )}

    </Container>
  )
}

export default SalesPage

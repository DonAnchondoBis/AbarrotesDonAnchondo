'use client'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  Button
} from '@mui/material'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import getClassPrefixer from '~/app/UI/classPrefixer'

import DataTable from '~/app/AdminModule/componets/DataTable'
import UsersTable from '~/app/AdminModule/componets/UsersTable'
import AddUserModal from './componets/AddUserModal'

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
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    marginBottom: '1ch',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
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
    height: '3rem',
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
  [`& .${classes.addButton}`]: {
    backgroundColor: theme.palette.contrast.main,
    borderRadius: '2rem',
    color: theme.palette.background.main,
    height: '3rem',
    textTransform: 'none',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: theme.palette.contrast.main,
      opacity: 0.9,
    }
  },
}));


const CompetitorPublicTable = ({
  selectedCategory,
  handleCategoryChange,
  search,
  handleSearchChange,
}) => {
  const [addOpen, setAddOpen] = useState(false)

  const handleOpenAdd = () => {
    setAddOpen(true)
  }

  const handleCloseAdd = () => {
    setAddOpen(false)
  }

  const handleConfirmAdd = (newUser) => {
    console.log('Nuevo usuario:', newUser)
    // Aquí puedes agregar el usuario a tu lista (con estado o petición al backend)
    handleCloseAdd()
  }

  return (
    <Container>
      <div className={classes.containerTools}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Users" value="User" />
          <Tab label="Data" value="Data" />
        </Tabs>

        {selectedCategory === 'User' && (
          <>
            <Button onClick={handleOpenAdd} className={classes.addButton} sx={{ alignSelf: 'center', marginLeft: 'auto' }}>
              Add User
            </Button>
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
          </>
        )}
      </div>

      <div className={classes.tableContainer}>
        {selectedCategory !== 'User' ? (
          <DataTable />
        ) : (
          <UsersTable search={search} />
        )}
      </div>

      <AddUserModal
        open={addOpen}
        onClose={handleCloseAdd}
        onConfirm={handleConfirmAdd}
      />
    </Container>
  )
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('User')
  const [search, setSearch] = useState('')

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = (event) => setSearch(event.target.value)

  return (
    <CompetitorPublicTable
      selectedCategory={selectedCategory}
      handleCategoryChange={handleCategoryChange}
      search={search}
      handleSearchChange={handleSearchChange}
    />
  )
}

export default Wrapper

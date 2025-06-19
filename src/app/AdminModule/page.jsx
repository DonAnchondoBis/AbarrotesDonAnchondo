'use client'

import { useEffect, useState } from 'react'
import {
  Tabs,
  Tab,
  OutlinedInput,
  InputAdornment,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'

import UsersTable from '~/app/AdminModule/componets/UsersTable'
import AddUserModal from '~/app/AdminModule/componets/AddUserModal'
import DataTable from '~/app/AdminModule/componets/DataTable'
import Loading from '~/app/UI/Shared/Loading'
import AuthWrapper from '~/app/Lib/Permissions/AuthWrapper'
import NotAvailable from '~/app/UI/Shared/NotAvailable'

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: '1rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  [`& .${classes.tableContainer}`]: {
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
    alignSelf: 'center',
    marginLeft: 'auto',
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
  }
}))

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
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const { token } = useToken()

  const fetchUsers = async () => {
    setIsLoading(true)
    const response = await apiFetch({
      url: '/api/user',
      token,
    })
    if (!response.error) setUsers(response)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = (e) => setSearch(e.target.value)
  const handleOpenAdd = () => setAddOpen(true)
  const handleCloseAdd = () => setAddOpen(false)

  const handleUserAdded = () => {
    fetchUsers()
  }

  const handleUserDeleted = () => {
    fetchUsers()
  }

  if (isLoading) return <Loading />

  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired="ADMIN">
      <Container>
        <div className={classes.containerTools}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
          >
            <Tab label="Users" value="User" />
            <Tab label="Data" value="Data" />
          </Tabs>

          {selectedCategory === 'User' && (
            <>
              <Button onClick={handleOpenAdd} className={classes.addButton}>
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
                    <SearchIcon color="background" />
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
            <UsersTable
              users={users}
              search={search}
              fetchUsers={fetchUsers}
              onUserDeleted={handleUserDeleted}
            />
          )}
        </div>

        <AddUserModal
          open={addOpen}
          onClose={handleCloseAdd}
          onUserAdded={handleUserAdded}
        />
      </Container>
    </AuthWrapper>
  )
}

export default CompetitorPublicTable

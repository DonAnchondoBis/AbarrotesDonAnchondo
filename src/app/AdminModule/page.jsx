'use client'

import { useEffect, useState } from 'react'
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

const displayName = 'AdminModule'
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
    alignItems: 'center',
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
    backgroundColor: theme.palette.green.main,
    borderRadius: '2rem',
    color: theme.palette.background.main,
    height: '3rem',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: theme.palette.green.dark,
    }
  }
}))

const AdminModule = ({
  selectedCategory,
  handleCategoryChange,
  search,
  handleSearchChange,
  handleOpenAdd,
  users,
  storeData,
  error,
  loading,
  fetchStoreData,
  fetchUsers,
  handleUserDeleted,
  addOpen,
  handleCloseAdd,
  handleUserAdded,
  snackbar,
  setSnackbar
}) => {
  if (loading) return <Loading />

  return (
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
          <Tab label="Store Info" value="Store Info" />
        </Tabs>

        {selectedCategory === 'User' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <OutlinedInput
              className={classes.searchInput}
              placeholder="Search by name"
              size="small"
              value={search}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="background" />
                </InputAdornment>
              }
            />
            <Button onClick={handleOpenAdd} className={classes.addButton}>
              Add User
            </Button>
          </div>
        )}
      </div>

      <div className={classes.tableContainer}>
        {selectedCategory !== 'User' ? (
          <DataTable
            data={storeData}
            error={error}
            loading={loading}
            fetchStoreData={fetchStoreData}
          />
        ) : (
          <UsersTable
            users={users}
            search={search}
            fetchUsers={fetchUsers}
            onUserDeleted={handleUserDeleted}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
          />
        )}
      </div>

      <Modal open={addOpen} onClose={handleCloseAdd}>
        <div>
          <AddUserModal
            open={addOpen}
            onClose={handleCloseAdd}
            onUserAdded={handleUserAdded}
            setSnackbarMessage={setSnackbar}
          />
        </div>
      </Modal>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar?.severity}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const Wrapper = () => {
  const [selectedCategory, setSelectedCategory] = useState('User')
  const [search, setSearch] = useState('')
  const [storeData, setStoreData] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [snackbar, setSnackbar] = useState(null)
  const { token } = useToken()

  const fetchUsers = async () => {
    const response = await apiFetch({
      url: '/api/user',
      token,
    })
    if (!response.error) {
      setUsers(response)
      setError(false)
    } else {
      setError(true)
    }
  }

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      const response = await apiFetch({ url: '/api/storeInfo', method: 'GET', token })
      if (response.error) {
        setError(true)
        setStoreData([])
      } else {
        setStoreData(response)
        setError(false)
      }
    } catch (err) {
      setError(true)
      setStoreData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchStoreData()
  }, [token])

  const handleCategoryChange = (_, newValue) => setSelectedCategory(newValue)
  const handleSearchChange = e => setSearch(e.target.value)
  const handleOpenAdd = () => setAddOpen(true)
  const handleCloseAdd = () => setAddOpen(false)
  const handleUserAdded = () => fetchUsers()
  const handleUserDeleted = () => fetchUsers()

  return (
    <AuthWrapper Fallback={NotAvailable} roleRequired="ADMIN">
      <AdminModule
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        search={search}
        handleSearchChange={handleSearchChange}
        handleOpenAdd={handleOpenAdd}
        users={users}
        storeData={storeData}
        error={error}
        loading={loading}
        fetchStoreData={fetchStoreData}
        fetchUsers={fetchUsers}
        handleUserDeleted={handleUserDeleted}
        addOpen={addOpen}
        handleCloseAdd={handleCloseAdd}
        handleUserAdded={handleUserAdded}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
    </AuthWrapper>
  )
}

export default Wrapper
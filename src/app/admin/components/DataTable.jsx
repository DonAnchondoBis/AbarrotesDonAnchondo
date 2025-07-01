'use client'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton, Typography as T, Modal, Snackbar, Alert } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import EditIcon from '@mui/icons-material/Edit'
import EditDataModal from './EditDataModal'
import { useToken } from '~/app/store/useToken'
import apiFetch from '~/app/Lib/apiFetch'
import Loading from '~/app/UI/Shared/Loading'

const displayName = 'AdminModule'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [`& .${classes.card}`]: {
    backgroundColor: theme.palette.contrast.main,
    border: `solid 3px ${theme.palette.primary.main}`,
    borderRadius: '1rem',
    width: '350px',
    padding: '2rem',
    boxShadow: theme.shadows[3],
  },
  [`& .${classes.header}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    width: '100%',
  },
  [`& .${classes.text}`]: {
    background: theme.palette.background.main,
    backgroundColor: theme.palette.background.main,
    borderRadius: '2rem',
    padding: '0 1rem',
  },
  [`& .${classes.inputGroup}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1ch',
  },
  [`& .${classes.currencyGroup}`]: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    '& > div': {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  [`& .${classes.title}`]: {
    color: theme.palette.background.main,
    fontWeight: 'bold',
  },
  [`& .${classes.iconBtn}`]: {
    color: theme.palette.background.main,
    padding: '0.5rem',
    marginLeft: '1rem',
  },
}))

const DataTableComponent = ({
  data,
  onEdit,
  isModalOpen,
  onCloseModal,
  selectedData,
  refresh,
  snackbar,
  setSnackbar
}) => {
  return (
    <>
      <Container>
        {data.map((store, index) => (
          <div key={index} className={classes.card}>
            <div className={classes.inputGroup}>
              <div className={classes.header}>
                <T variant="h5" className={classes.title}>
                  Store Information
                </T>
                <IconButton
                  className={classes.iconBtn}
                  onClick={onEdit}
                  aria-label="edit"
                >
                  <EditIcon color="background" />
                </IconButton>
              </div>
              <T variant="h6" className={classes.title}>Name</T>
              <T variant="h6" className={classes.text}>{store.name || 'N/A'}</T>
              <T variant="h6" className={classes.title}>Address</T>
              <T variant="h6" className={classes.text}>{store.address || 'N/A'}</T>
              <T variant="h6" className={classes.title}>Phone Number</T>
              <T variant="h6" className={classes.text}>{store.phone || 'N/A'}</T>
              <T variant="h5" className={classes.title} align="center">Currencies</T>
              <div className={classes.currencyGroup}>
                <div>
                  <T variant="h6" className={classes.title}>Dollar</T>
                  <T variant="h6" className={classes.text}>
                    {store.dollarValue ? `$ ${store.dollarValue}` : 'N/A'}
                  </T>
                </div>
                <div>
                  <T variant="h6" className={classes.title}>Yen</T>
                  <T variant="h6" className={classes.text}>
                    {store.yenValue ? `¥ ${store.yenValue}` : 'N/A'}
                  </T>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Container>

      <Modal open={isModalOpen} onClose={onCloseModal}>
        <div>
          <EditDataModal
            data={selectedData}
            onClose={onCloseModal}
            refresh={refresh}
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
    </>
  )
}

const Wrapper = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState(null)
  const { token } = useToken()



  const refresh = async () => {
    setIsLoading(true)
    try {
      const response = await apiFetch({
        url: '/api/storeInfo',
        method: 'GET',
        token
      })
      setData(response?.error ? [] : response)
    } catch (error) {
      setSnackbar({
        message: 'Error loading store data',
        severity: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [token])

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  if (isLoading) return <Loading />

  return (
    <DataTableComponent
      data={data}
      onEdit={handleOpenModal}
      isModalOpen={isModalOpen}
      onCloseModal={handleCloseModal}
      selectedData={data[0]}
      refresh={refresh}
      snackbar={snackbar}
      setSnackbar={setSnackbar}
    />
  )
}

export default Wrapper
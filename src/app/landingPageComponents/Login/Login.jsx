'use client'
import { useState } from 'react'

import Loading from '~/app/UI/Shared/Loading'

import { Formik, Form, Field, useFormikContext } from 'formik'
import TextField from '~/app/UI/Shared/FormikTextField'

import { styled } from '@mui/material/styles'
import { Button, Typography as T, Snackbar, Alert } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { getUserLoginValidationSchema } from './utils'

import apiFetch from '~/app/Lib/apiFetch'
import { useToken } from '~/app/store/useToken'

const displayName = 'Login'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding: '8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 768px)': {
    padding: '6rem 4rem',
  },

  [`& .${classes.form}`]: {
    backgroundColor: theme.palette.primary.main,
    padding: '4rem 2rem',
    borderRadius: '1rem',
    width: '25vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '400px'
  },

  [`& .${classes.button}`]: {
    border: `1px solid ${theme.palette.background.main}`,
    padding: '1ch 2rem',
    backgroundColor: theme.palette.contrast.main,
    '&.Mui-disabled, &:disabled': {
      background: theme.palette.gray.inactive,
      color: theme.palette.background.muted,
      border: `1px solid ${theme.palette.background.muted}`,
    }
  },
  [`& .${classes.title}`]: {
    color: theme.palette.background.main,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  [`& .${classes.inputContainer}`]: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  [`& .${classes.input}`]: {
    background: theme.palette.background.main,
    fontWeight: 'bold',
    fontStyle: 'italic',
    borderRadius: '2rem',
    margin: 'dense',

    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.primary.muted}`,
      borderRadius: '2rem',
    },

    '& .MuiInputLabel-outlined': {
      backgroundColor: theme.palette.background.main,
      borderRadius: '1ch',
      padding: '0 1rem',
      marginLeft: '-4px',
    }
  },


  [`& .${classes.buttonContainer}`]: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

const Login = ({
  setSnackbarMessage,
  snackbarMessage
}) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <div className={classes.form}>
        <T variant="h3" className={classes.title}>
          Welcome
        </T>
        <div className={classes.inputContainer}>
          <Field
            className={classes.input}
            name="username"
            component={TextField}
            placeholder="Username"
            type="text"
            label="username"
            variant="outlined"
          />
          <Field
            className={classes.input}
            name="password"
            component={TextField}
            placeholder="Password"
            type="password"
            label="Password"
            variant="outlined"
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button className={classes.button}
            disabled={!isValid || !dirty}
            type='submit'
            variant='contained'
          >
            LOG IN
          </Button>
        </div>
      </div>
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={5000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbarMessage?.severity}
        >
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const Wrapper = ({
  setPage
}) => {
  const { setToken } = useToken()
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = getUserLoginValidationSchema()
  const initialValues = {
    username: '',
    password: ''
  }

  const handleSubmit = async values => {
    setIsLoading(true)
    const response = await apiFetch({
      payload: values,
      url: '/api/user/login',
      method: 'POST',
    })
    if (response.error) {
      setSnackbarMessage({
        message: 'Login Error',
        severity: 'error'
      })
    } else {
      setToken(response)
      setPage('Dashboard')
    }
    setIsLoading(false)
  }

  if (isLoading) return <Loading />

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <Login
          setSnackbarMessage={setSnackbarMessage}
          snackbarMessage={snackbarMessage}
          setPage={setPage}
        />
      </Form>
    </Formik>
  )
}

export default Wrapper


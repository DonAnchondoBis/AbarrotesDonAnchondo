'use client'

import { Formik, Form, Field, useFormikContext } from 'formik'
import TextField from '~/app/UI/Shared/FormikTextField'

import { styled } from '@mui/material/styles'
import { Button, Typography as T } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { getUserLoginValidationSchema } from './utils'

const displayName = 'Login'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding: '15rem',
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
    borderRadius: '1ch',
    margin: 'dense',
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

const Login = () => {
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
            name="user"
            component={TextField}
            placeholder="Username"
            type="text"
            label="User"
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
    </Container>
  )
}

const Wrapper = () => {

  const validationSchema = getUserLoginValidationSchema()
  const initialValues = {
    user: '',
    password: ''
  }

  const handleSubmit = values => {
    console.error('Form submitted with values:', values)
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <Login />
      </Form>
    </Formik>
  )
}

export default Wrapper


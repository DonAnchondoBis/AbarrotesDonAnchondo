'use client'
import { Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'SalesPage'

const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding: '15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', 
  [`& .${classes.row}`]: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10rem'
  }
}))

const SalesPage = () => {
  return (
    <Container >
      <div className={classes.row}>
        <div>
          <T variant='h1'>Hola</T>
        </div>
        <div>
          pla
        </div>
      </div>
    </Container>
  )
}

const Wrapper = () => {
  return (
    <SalesPage />
  )
}

export default Wrapper
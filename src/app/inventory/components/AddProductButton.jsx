'use client'

import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'AddProductButton'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding: '1rem 0',
  [`& .${classes.button}`]: {
    color: theme.palette.background.main,
    textTransform: 'none',
    height: '40px',
  }
}))

const AddProductButton = ({ onClick }) => {
  return (
    <Container>
      <Button
        variant="contained"
        color="green"
        className={classes.button}
        onClick={onClick}
      >
        Add Product
      </Button>
    </Container>
  )
}

export default AddProductButton

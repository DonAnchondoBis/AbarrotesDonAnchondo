'use client'

import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { IconButton, Typography as T } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaidIcon from '@mui/icons-material/Paid'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'

const displayName = 'Dasboard'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '2',
  padding: '12rem',
  //minHeight: '90vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  boxSizing: 'border-box',

  '& a': {
    textDecoration: 'none',
  },

  '@media (min-width: 481px) and (max-width: 768px)': {
    padding: '1.5rem',
  },

  '@media (max-width: 480px)': {
    padding: '1rem',
  },

  [`& .${classes.btnContainer}`]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 16rem)',
    width: '100%',
    gap: '4rem',
    alignItems: 'center',
    justifyContent: 'center',

    '@media (min-width: 481px) and (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, 12rem)',
      gap: '1rem',
    },

    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(auto-fit, 10rem)',
      gap: '2rem',
    },
  },

  [`& .${classes.btn}`]: {
    backgroundColor: theme.palette.contrast.main,
    border: `6px solid ${theme.palette.primary.main}`,
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16rem',
    aspectRatio: '1',
    '&:hover': {
      backgroundColor: theme.palette.contrast.dark
    },

    '@media (min-width: 481px) and (max-width: 768px)': {
      width: '12rem',
    },

    '@media (max-width: 480px)': {
      width: '10rem',
    },
  },

  [`& .${classes.icon}`]: {
    color: theme.palette.background.main,
    fontSize: '10rem',
    marginBottom: '0.5rem',

    '@media (min-width: 481px) and (max-width: 768px)': {
      fontSize: '8rem',
    },

    '@media (max-width: 480px)': {
      fontSize: '5rem',
    },
  },

  [`& .${classes.text}`]: {
    color: theme.palette.background.main,
    textAlign: 'center',
  }
}))

const Dasboard = () => {
  return (
    <Container>
      <div className={classes.btnContainer}>
        <Link href="/point-of-sale">
          <IconButton className={classes.btn}>
            <ShoppingCartIcon className={classes.icon} />
            <T variant="h4" className={classes.text}>Point Of Sale</T>
          </IconButton>
        </Link>

        <Link href="/inventory">
          <IconButton className={classes.btn}>
            <InventoryIcon className={classes.icon} />
            <T variant="h4" className={classes.text}>Inventory</T>
          </IconButton>
        </Link>

        <Link href="/payments">
          <IconButton className={classes.btn}>
            <PaidIcon className={classes.icon} />
            <T variant="h4" className={classes.text}>Payments</T>
          </IconButton>
        </Link>

        <Link href="/reports">
          <IconButton className={classes.btn}>
            <DescriptionIcon className={classes.icon} />
            <T variant="h4" className={classes.text}>Reports</T>
          </IconButton>
        </Link>

        <Link href="/settings">
          <IconButton className={classes.btn}>
            <SettingsIcon className={classes.icon} />
            <T variant="h4" className={classes.text}>Settings</T>
          </IconButton>
        </Link>
      </div>
    </Container>
  )
}

export default Dasboard

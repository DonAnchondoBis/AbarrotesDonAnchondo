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
import usePermitted from '~/app/Lib/Permissions/utils'

const displayName = 'Dashboard'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: '8rem',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
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
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width: 481px) and (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: ' 1rem',
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
    width: '250px',
    '@media (min-width: 481px) and (max-width: 768px)': {
      width: '200px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      width: '150px',
    },
    aspectRatio: '1',
    '&:hover': {
      backgroundColor: theme.palette.contrast.dark
    },
  },
  [`& .${classes.icon}`]: {
    color: theme.palette.background.main,
    fontSize: '8rem',
    marginBottom: '0.5rem',
  },
  [`& .${classes.text}`]: {
    color: theme.palette.background.main,
    textAlign: 'center',
  }
}))

const Dashboard = () => {
  return (
    <Container>
      <div className={classes.btnContainer}>
        {usePermitted({ roleRequired: 'CASHIER' }) && (
          <Link href="/pointOfSale">
            <IconButton className={classes.btn}>
              <ShoppingCartIcon className={classes.icon} />
              <T variant="h5" className={classes.text}>Point Of Sale</T>
            </IconButton>
          </Link>
        )}
        {usePermitted({ roleRequired: 'WAREHOUSE' }) && (
          <Link href="/inventory">
            <IconButton className={classes.btn}>
              <InventoryIcon className={classes.icon} />
              <T variant="h5" className={classes.text}>Inventory</T>
            </IconButton>
          </Link>
        )}
        {usePermitted({ roleRequired: 'WAREHOUSE' }) && (
          <Link href="/purchasing">
            <IconButton className={classes.btn}>
              <PaidIcon className={classes.icon} />
              <T variant="h5" className={classes.text}>Purchasing</T>
            </IconButton>
          </Link>
        )}
        {usePermitted({ roleRequired: 'ADMIN' }) && (
          <Link href="/reports">
            <IconButton className={classes.btn}>
              <DescriptionIcon className={classes.icon} />
              <T variant="h5" className={classes.text}>Reports</T>
            </IconButton>
          </Link>
        )}
        {usePermitted({ roleRequired: 'ADMIN' }) && (
          <Link href="/settings">
            <IconButton className={classes.btn}>
              <SettingsIcon className={classes.icon} />
              <T variant="h5" className={classes.text}>Settings</T>
            </IconButton>
          </Link>
        )}
      </div>
    </Container>
  )
}

export default Dashboard
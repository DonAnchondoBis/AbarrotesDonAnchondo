'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaidIcon from '@mui/icons-material/Paid'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'
import usePermitted from '~/app/Lib/Permissions/utils'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'

export const useSideBarOpts = () => ([
  {
    title: 'Home',
    path: '/',
    Icon: props => <HomeIcon {...props} />,
    status: 'available'
  },
  {
    title: 'Point of Sale',
    path: '/point-of-sale',
    Icon: props => <ShoppingCartIcon {...props} />,
    status: (usePermitted({ roleRequired: 'CASHIER' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Inventory',
    path: '/inventory',
    Icon: props => <InventoryIcon {...props} />,
    status: (usePermitted({ roleRequired: 'WAREHOUSE' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Acquisitions',
    path: '/acquisitions',
    Icon: props => <PaidIcon {...props} />,
    status: (usePermitted({ roleRequired: 'WAREHOUSE' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Reports',
    path: '/reports',
    Icon: props => <DescriptionIcon {...props} />,
    status: (usePermitted({ roleRequired: 'ADMIN' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Settings',
    path: '/settings',
    Icon: props => <SettingsIcon {...props} />,
    status: (usePermitted({ roleRequired: 'ADMIN' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Logout',
    path: '/logout',
    Icon: props => <LogoutIcon {...props} />,
    status: 'available'
  },
])
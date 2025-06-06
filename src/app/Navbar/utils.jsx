'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaidIcon from '@mui/icons-material/Paid'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'
import usePermmitted from '~/app/Lib/Permissions/utils'

export const useSideBarOpts = () => ([
  {
    title: 'Point of Sale',
    path: '/point-of-sale',
    Icon: props => <ShoppingCartIcon {...props} />,
    status: (usePermmitted({ roleRequired: 'CASHIER' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Inventory',
    path: '/inventory',
    Icon: props => <InventoryIcon {...props} />,
    status: (usePermmitted({ roleRequired: 'WAREHOUSE' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Purchasing',
    path: '/purchasing',
    Icon: props => <PaidIcon {...props} />,
    status: (usePermmitted({ roleRequired: 'WAREHOUSE' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Reports',
    path: '/reports',
    Icon: props => <DescriptionIcon {...props} />,
    status: (usePermmitted({ roleRequired: 'ADMIN' }) ? 'available' : 'unavailable')
  },
  {
    title: 'Settings',
    path: '/settings',
    Icon: props => <SettingsIcon {...props} />,
    status: (usePermmitted({ roleRequired: 'ADMIN' }) ? 'available' : 'unavailable')
  },
])
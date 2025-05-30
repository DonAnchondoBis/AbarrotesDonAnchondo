'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaidIcon from '@mui/icons-material/Paid'
import DescriptionIcon from '@mui/icons-material/Description'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SettingsIcon from '@mui/icons-material/Settings'

export const SIDEBAR_OPTS = [
  {
    title: 'Point of Sale',
    path: '/point-of-sale',
    Icon: props => <ShoppingCartIcon {...props} />,
    status: 'available'
  },
  {
    title: 'Inventory',
    path: '/inventory',
    Icon: props => <InventoryIcon {...props} />,
    status: 'available'
  },
  {
    title: 'Purchasing',
    path: '/purchasing',
    Icon: props => <PaidIcon {...props} />,
    status: 'available'
  },
  {
    title: 'Reports',
    path: '/reports',
    Icon: props => <DescriptionIcon {...props} />,
    status: 'available'
  },
  {
    title: 'Settings',
    path: '/settings',
    Icon: props => <SettingsIcon {...props} />,
    status: 'available'
  },
]

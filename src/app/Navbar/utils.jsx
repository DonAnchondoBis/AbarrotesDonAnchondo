'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaidIcon from '@mui/icons-material/Paid'
import DescriptionIcon from '@mui/icons-material/Description'
import PersonIcon from '@mui/icons-material/Person'
import usePermitted from '~/app/Lib/Permissions/utils'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import { useToken } from '~/app/store/useToken'
import { useData } from '~/app/store/useData'
import { useRouter } from 'next/navigation'

export const useSideBarOpts = () => {
  const { setToken } = useToken()
  const { setRole, setUserId } = useData()
  const router = useRouter()

  const handleLogout = () => {
    setToken(null)
    setRole(null)
    setUserId(null)
    router.replace('/')
  }

  return [
    {
      title: 'Home',
      path: '/',
      Icon: props => <HomeIcon {...props} />,
      status: (usePermitted({ roleRequired: ['ADMIN', 'WAREHOUSE'] }) ? 'available' : 'unavailable')
    },
    {
      title: 'Point of Sale',
      path: '/pointOfSale',
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
      title: 'Admin',
      path: '/admin',
      Icon: props => <PersonIcon {...props} />,
      status: (usePermitted({ roleRequired: 'ADMIN' }) ? 'available' : 'unavailable')
    },
    {
      title: 'Logout',
      Icon: props => <LogoutIcon {...props} />,
      status: 'available',
      onClick: handleLogout
    },
  ]
}
'use client'
import { useState, useEffect } from 'react'
import { useData } from '~/app/store/useData'
import Login from '~/app/landingPageComponents/Login/Login'
import Dashboard from '~/app/landingPageComponents/Dashboard/Dashboard'
import PointOfSale from '~/app/pointOfSale/page'
import apiFetch from '~/app/Lib/apiFetch'
import Loading from '~/app/UI/Shared/Loading'
import { useToken } from '~/app/store/useToken'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { role, setRole, setUserId } = useData()
  const { setToken, token } = useToken()
  const [page, setPage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const response = await apiFetch({
        url: '/api/verify',
        method: 'GET',
        token
      })
      if (response.error) {
        setPage('Login')
        setToken(null)
        setRole(null)
        setUserId(null)
      } else {
        setRole(response.role)
        setUserId(response.userId)
        if (response.role === 'ADMIN' || response.role === 'WAREHOUSE') {
          setPage('Dashboard')
        } else if (response.role === 'CASHIER') {
          setPage('PointOfSale')
        }
      }
      setIsLoading(false)
    }

    verifyToken()
  }, [token, role, setRole, setUserId, setToken])

  if (isLoading) return <Loading />
  if (page === 'Login') return <Login setPage={setPage} />
  if (page === 'Dashboard') return <Dashboard />
  if (page === 'PointOfSale') return <PointOfSale />
  return <Loading />
}

export default Home
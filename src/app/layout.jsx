'use client'
import ThemeRegistry from '~/app/UI/Theme'
import NavBar from '~/app/Navbar'
import { favIcon } from '~/app/UI/Images'
import usePermitted from '~/app/Lib/Permissions/utils'

const metadata = {
  title: 'Abarrotes Don Anchondo',
  description: 'Abarrotes Don Anchondo - Tu tienda de confianza',
}


const RootLayout = ({ children }) => {
  const isLogged = usePermitted({ roleRequired: ['WAREHOUSE', 'CASHIER'] })
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" type="image/svg+xml" href={favIcon} />
      </head>
      <ThemeRegistry>
        <body>
          {isLogged && <NavBar />}
          {children}
        </body>
      </ThemeRegistry>
    </html>
  )
}

export default RootLayout
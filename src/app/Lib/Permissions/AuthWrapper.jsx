import usePermitted from '~/app/Permissions/utils'

const AuthWrapper = ({ children, Fallback }) => {
  const permitted = usePermitted()
  if (permitted) {
    return (
      <>
        {children}
      </>
    )
  }
  return <Fallback/>
}

export default AuthWrapper
import usePermmitted from '~/app/Permissions/utils'

const AuthWrapper = ({ chilldren, Fallback }) => {
  const permitted = usePermmitted()
  if (permitted) {
    return (
      <>
        {chilldren}
      </>
    )
  }
  return <Fallback/>
}

export default AuthWrapper
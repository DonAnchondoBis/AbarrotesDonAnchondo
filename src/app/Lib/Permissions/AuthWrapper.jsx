import usePermitted from '~/app/Lib/Permissions/utils';

const AuthWrapper = ({ children, Fallback, roleRequired = 'ADMIN' }) => {
  const permitted = usePermitted({ roleRequired });

  if (permitted) {
    return <>{children}</>;
  }

  return <Fallback />;
};

export default AuthWrapper;

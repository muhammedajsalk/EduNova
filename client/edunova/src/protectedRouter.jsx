import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ user }) => {
  console.log("user",user)
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export const RoleProtectedRoute = ({ user, allowedRoles ,loading}) => {
  if(loading) return null
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/notFound" />;
  return <Outlet />;
};



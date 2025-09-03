import { Navigate, Outlet } from 'react-router-dom';

export const PublicPageAccess = ({ user }) => {
    if (user?.role === 'instructor') {
        return <Navigate to="/instructorDashboard" />;
    }
    return <Outlet />;
};

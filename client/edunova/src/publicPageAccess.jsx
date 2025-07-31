import { Navigate, Outlet } from 'react-router-dom';

export const PublicPageAccess = ({ user }) => {
    if (user?.role === 'instructor') {
        // Redirect instructors away from public pages
        return <Navigate to="/instructorDashboard" />;
    }
    return <Outlet />;
};

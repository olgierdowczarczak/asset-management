import { Navigate } from 'react-router-dom';
import { Routes } from '@/config';
import { useAuth } from '@/hooks';

function LogoutRoute() {
    const { logout, loading } = useAuth();
    if (loading) {
        return null;
    }

    logout();
    return <Navigate to={Routes.LOGIN} replace />;
};

export default LogoutRoute;

import { Navigate, Outlet } from 'react-router-dom';
import config from '@/config';
import { useAuth } from '@/hooks';

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();
    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to={config.routes.login} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

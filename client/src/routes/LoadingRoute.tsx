import { Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

function LoadingRoute() {
    const { loading } = useAuth();
    if (loading) {
        return null;
    }

    return <Outlet />;
}

export default LoadingRoute;

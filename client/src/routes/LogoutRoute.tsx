import { Navigate } from 'react-router-dom';
import config from '@/config';
import { useAuth } from '@/hooks';
import { validateError } from '@/lib/helpers';

function LogoutRoute() {
    const { logout } = useAuth();

    try {
        logout();
    } catch (err: any) {
        validateError(err, 'Logout failed');
    }

    return <Navigate to={config.routes.login} replace />;
}

export default LogoutRoute;

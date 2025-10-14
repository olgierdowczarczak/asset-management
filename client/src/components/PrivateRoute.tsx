import { Outlet, Navigate } from 'react-router-dom';
import ROUTES from '../config/routes';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
    const { isLoggedIn, isChecked } = useAuth();
    if (!isChecked) {
        return null;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.auth.login} />;
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { useAuth } from '../../context/AuthContext';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        const doLogout = async () => {
            if (!isLoggedIn) {
                return null;
            }

            try {
                await logout();
            } finally {
                navigate(ROUTES.auth.login, { replace: true });
            }
        };

        doLogout();
    }, [isLoggedIn, logout, navigate]);

    return null;
}

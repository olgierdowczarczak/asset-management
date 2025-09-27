import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { useAuth } from '../../context/AuthContext';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { isLoggedIn, isChecked, logout } = useAuth();

    useEffect(() => {
        const redirect = async () => {
            try {
                await logout();
            } catch (err) {
                console.error('Logout failed', err);
            }
        };
        
        if (isLoggedIn) {
            redirect();
        }
        navigate(ROUTES.home);
    }, [isChecked]);

    return null;
}

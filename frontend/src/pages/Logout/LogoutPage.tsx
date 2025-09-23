import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { logoutUser } from '../../api/auth';

export default function LogoutPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const logOut = async () => {
            try {
                await logoutUser();
            } catch (err) {
                console.error('Logout failed', err);
            } finally {
                navigate(ROUTES.home);
            }
        };

        logOut();
    }, [navigate]);

    return <p>Logging out...</p>;
}

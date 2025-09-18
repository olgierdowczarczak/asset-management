import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

export default function LogoutPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const logOut = async () => {
            await logoutUser();
            navigate('/');
        };

        logOut();
    }, [navigate]);

    return <p>Logout...</p>;
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth.ts';

export default function () {
    const navigate = useNavigate();

    useEffect(() => {
        const sendQuitInfo = async () => {
            try {
                await logout();
            } catch (err: any) {
                console.log(err.response?.data?.message || 'Server error');
            } finally {
                localStorage.clear();
                navigate('/');
            }
        };

        sendQuitInfo();
    }, [navigate]);

    return null;
};
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type LoginRequest from '../../types/auth';
import ROUTES from '../../config/routes';
import { useAuth } from '../../context/AuthContext';
import style from './LoginPage.module.css';

export default function LoginPage() {
    const [credentials, setCredentials] = useState<LoginRequest>({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [checked, isChecked] = useState<boolean>(false);
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(credentials);
            navigate(ROUTES.home);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev: LoginRequest) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate(ROUTES.home);
            return;
        }

        isChecked(true);
    }, [navigate]);

    if (!checked) {
        return null;
    }

    return (
        <div className={style.container}>
            <form onSubmit={handleLogin}>
                {error && <div className={style.error}>{error}</div>}

                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleValueChange}
                    placeholder="username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleValueChange}
                    placeholder="password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type LoginRequest from '../../types/auth';
import ROUTES from '../../config/routes';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const [credentials, setCredentials] = useState<LoginRequest>({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { isLoggedIn, isChecked, login } = useAuth();
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
    }, [isChecked]);

    if (!isChecked) {
        return null;
    }

    return (
        <div className={styles.container}>
            <form className={styles['login-page-form']} onSubmit={handleLogin}>
                {error && <div className={styles['login-page-error']}>{error}</div>}

                <input
                    className={styles['login-page-input']}
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleValueChange}
                    placeholder="username"
                    required
                />
                <input
                    className={styles['login-page-input']}
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleValueChange}
                    placeholder="password"
                    required
                />
                <button className={styles['login-page-button']} type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

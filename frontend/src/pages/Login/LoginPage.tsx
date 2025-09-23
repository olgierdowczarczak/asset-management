import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { loginUser } from '../../api/auth';
import type { LoginRequest } from '../../types/auth';
import style from './LoginPage.module.css';

export default function LoginPage() {
    const [credentials, setCredentials] = useState<LoginRequest>({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await loginUser(credentials);
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

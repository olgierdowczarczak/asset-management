import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { loginUser } from '../../api/auth';
import type { LoginRequest } from '../../types/auth';

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
        <>
            <h1>Login Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleLogin}>
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
        </>
    );
}

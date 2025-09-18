import { useState } from 'react';
import { loginUser } from '../api/auth';
import type { LoginRequest } from '../types/auth';

export default function LoginPage() {
    const [credentials, setCredentials] = useState<LoginRequest>({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await loginUser(credentials);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev: any) => ({ ...prev, [name]: value }));
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
                <br />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleValueChange}
                    placeholder="password"
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
        </>
    );
}

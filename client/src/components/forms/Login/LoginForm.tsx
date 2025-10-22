import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { LoginFormData } from '@/types';
import { Routes } from '@/config';
import { useAuth } from '@/hooks';

function LoginForm() {
    const { login, loading, isAuthenticated } = useAuth();
    const [credentials, setCredentials] = useState<LoginFormData>({
        username: '',
        password: '',
        isRemembered: false
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await login(credentials);
            navigate(Routes.HOME);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setCredentials((prev: LoginFormData) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to={Routes.HOME} replace />;
    }

    return (
        <>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='username'
                    value={credentials.username}
                    onChange={handleValueChange}
                    placeholder='username'
                    required
                />
                <input
                    type='password'
                    name='password'
                    value={credentials.password}
                    onChange={handleValueChange}
                    placeholder='password'
                    required
                />
                <label>
                    <input
                        type='checkbox'
                        name='isRemembered'
                        checked={credentials.isRemembered}
                        onChange={handleValueChange}
                    />
                    Remember me
                </label>
                <button type='submit'>Login</button>
            </form>
        </>
    );
}

export default LoginForm;

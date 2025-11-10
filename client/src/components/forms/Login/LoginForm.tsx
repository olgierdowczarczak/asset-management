import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ILoginForm } from '@/types';
import config from '@/config';
import useAuth from '@/hooks/useAuth';
import validateError from '@/lib/helpers/validateError';

function LoginForm() {
    const { login, isAuthenticated } = useAuth();
    const [credentials, setCredentials] = useState<ILoginForm>({
        username: '',
        password: '',
        isRemembered: false,
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await login(credentials);
            navigate(config.routes.home);
        } catch (err: any) {
            validateError(err, 'Login failed');
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setCredentials((prev: ILoginForm) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    if (isAuthenticated) {
        return <Navigate to={config.routes.home} replace />;
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

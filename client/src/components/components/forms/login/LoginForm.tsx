import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ILoginForm } from '@/types';
import config from '@/config';
import useAuth from '@/hooks/useAuth';
import validateError from '@/lib/validateError';
import { Button, Input, Label } from '@/components';

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
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Asset Management</h1>
                <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="username" required>
                        Username
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleValueChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="password" required>
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleValueChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="isRemembered"
                        type="checkbox"
                        name="isRemembered"
                        checked={credentials.isRemembered}
                        onChange={handleValueChange}
                        className="w-4 h-4 text-primary-600 bg-gray-800 border-gray-700 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <Label htmlFor="isRemembered" className="ml-2 mb-0">
                        Remember me
                    </Label>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                    Sign in
                </Button>
            </form>
        </div>
    );
}

export default LoginForm;

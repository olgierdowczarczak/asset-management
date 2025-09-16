import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/users';

type Input = {
    type: string;
    name: string;
    placeholder: string;
};

type FormData = {
    username: string;
    password: string;
};

export default function () {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData | any>({ username: '', password: '' });
    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await createUser(formData);
            navigate('/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Create failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const inputs: Input[] = [
        { type: 'text', name: 'username', placeholder: 'Username' },
        { type: 'text', name: 'password', placeholder: 'Password' },
    ];

    return (
        <>
            <h1>Create user Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleFormSubmit}>
                {inputs.map(({ type, name, placeholder }, id) => (
                    <div key={id}>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            placeholder={placeholder}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                {!loading && <button>{loading ? 'Loading...' : 'Create'}</button>}
            </form>
        </>
    );
}

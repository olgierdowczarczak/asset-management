import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveUsers } from '../api/users';

type User = {
    id: number;
    username: string;
};

export default function () {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/users/create');
    };

    const handleClick = (userId: number) => {
        navigate(`/users/${userId}`);
    };

    useEffect(() => {
        const getData = async () => {
            setError(null);
            setLoading(true);

            try {
                const dbUsers: User[] = await getActiveUsers('');
                setUsers(dbUsers);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    return (
        <>
            <h1>Users Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {users.map((user) => (
                        <div key={user.id}>
                            <button onClick={() => handleClick(user.id)}>{user.id}</button> - {user.username}
                        </div>
                    ))}
                </div>
            )}
            {!loading && <button type='submit' onClick={handleSubmit}>{loading ? 'Loading...' : 'Create user'}</button>}
        </>
    );
};
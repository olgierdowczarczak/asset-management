import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser, deleteUser } from '../api/user';

type User = {
    _id: string;
    id: number;
    username: string;
    is_admin: boolean;
};

export default function () {
    const [user, setUser] = useState<null | User>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { _id } = useParams<string>();
    const navigate = useNavigate();

    const handleUpdate = async () => {
        setError(null);
        setLoading(true);

        try {
            const updatedUser: User = await updateUser(_id!, user!);
            setUser(updatedUser);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError(null);
        setLoading(true);

        try {
            await deleteUser(_id!);
            navigate('/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUsers = async () => {
            setError(null);
            setLoading(true);

            try {
                const user: User = await getUser(_id!);
                setUser(user);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [_id]);

    return (
        <>
            <h1>User Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div>
                        <div>{user?.username}</div>
                        <div>{user?.is_admin ? 'Yes' : 'No'}</div>
                    </div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </>
    );
};
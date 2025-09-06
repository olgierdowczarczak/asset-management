import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAsset, updateAsset, deleteAsset } from '../api/asset';

type Asset = {
    id: number;
    name: string;
};

export default function () {
    const [asset, setAsset] = useState<null | Asset>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams<string>();
    const navigate = useNavigate();

    const handleUpdate = async () => {
        setError(null);
        setLoading(true);

        try {
            const updatedAsset: Asset = await updateAsset(Number(id!) || 0, asset!);
            setAsset(updatedAsset);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update asset');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError(null);
        setLoading(true);

        try {
            await deleteAsset(Number(id));
            navigate('/assets');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch asset');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getData = async () => {
            setError(null);
            setLoading(true);

            try {
                const asset: Asset = await getAsset(Number(id));
                setAsset(asset);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch asset');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [id]);

    return (
        <>
            <h1>Asset Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div>
                        <div>{asset?.name}</div>
                    </div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </>
    );
};
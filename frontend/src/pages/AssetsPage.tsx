import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveAssets } from '../api/assets';

type Asset = {
    id: number;
    name: string;
};

export default function () {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/assets/create');
    };

    const handleClick = (assetId: number) => {
        navigate(`/assets/${assetId}`);
    };

    useEffect(() => {
        const getData = async () => {
            setError(null);
            setLoading(true);

            try {
                const dbAssets: Asset[] = await getActiveAssets('');
                setAssets(dbAssets);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch assets');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    return (
        <>
            <h1>Assets Page</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {assets.map((asset) => (
                        <div key={asset.id}>
                            <button onClick={() => handleClick(asset.id)}>{asset.id}</button> - {asset.name}
                        </div>
                    ))}
                </div>
            )}
            {!loading && <button type='submit' onClick={handleSubmit}>{loading ? 'Loading...' : 'Create asset'}</button>}
        </>
    );
};
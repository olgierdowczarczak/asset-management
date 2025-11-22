import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, SchemaForm } from '@/components';
import { extractErrorMessage } from '@/lib/errorHandler';

function EditPage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const isMainAdmin = controller.path === 'users' && id === '1';

    useEffect(() => {
        if (isMainAdmin) {
            navigate(`/${controller.path}/${id}`);
            return;
        }

        let isMounted = true;
        const fetchData = async () => {
            if (!id) {
                return;
            }

            if (isMounted) {
                setLoading(true);
                setError(null);
                setData(null);
            }

            try {
                const result = await controller.service.get(Number(id));
                if (isMounted) {
                    setData(result);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setError(extractErrorMessage(err));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [id, controller, isMainAdmin, navigate]);

    const handleSubmit = async (formData: Record<string, any>) => {
        setSaving(true);
        setError(null);

        try {
            await controller.service.edit(Number(id), formData as Partial<T>);
            navigate(`/${controller.path}`);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-gray-400">Loading...</div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    Edit{' '}
                    {controller.resourceName.charAt(0).toUpperCase() +
                        controller.resourceName.slice(1)}
                </h1>
                <Button variant="secondary" onClick={() => navigate(`/${controller.path}/${id}`)}>
                    Back
                </Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
                    {error}
                </div>
            )}

            <Card className="p-6">
                {controller.schema && data ? (
                    <SchemaForm
                        key={`${controller.path}-${id}`}
                        schema={controller.schema}
                        initialData={data}
                        onSubmit={handleSubmit}
                        submitButtonText="Save Changes"
                        isLoading={saving}
                    />
                ) : (
                    <div className="text-center text-gray-400">
                        No schema defined for this resource
                    </div>
                )}
            </Card>
        </div>
    );
}

export default EditPage;

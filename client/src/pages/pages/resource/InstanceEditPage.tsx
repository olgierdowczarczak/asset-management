import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, SchemaForm } from '@/components';
import { extractErrorMessage } from '@/lib/errorHandler';
import type { IResourceSchema } from '@/types';

interface InstanceEditPageProps<T extends { id: number }> {
    controller: PageController<T> & {
        instanceService?: any;
        instanceSchema?: IResourceSchema;
    };
}

function InstanceEditPage<T extends { id: number }>({ controller }: InstanceEditPageProps<T>) {
    const instanceService = controller.instanceService;
    const instanceSchema = controller.instanceSchema;
    const { id, instanceId } = useParams<{ id: string; instanceId: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    if (!instanceService || !instanceSchema) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="text-center text-red-400 p-8">
                    This controller is not configured for instance management.
                </div>
            </div>
        );
    }

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!id || !instanceId) {
                return;
            }

            if (isMounted) {
                setLoading(true);
                setError(null);
                setData(null);
            }

            try {
                const result = await instanceService.getInstance(Number(id), Number(instanceId));
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
    }, [id, instanceId, instanceService]);

    const handleSubmit = async (formData: Record<string, any>) => {
        if (!id || !instanceId) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await instanceService.editInstance(Number(id), Number(instanceId), formData);
            navigate(`/${controller.path}/${id}`);
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
                        controller.resourceName.slice(1)}{' '}
                    Instance
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
                {instanceSchema && data ? (
                    <SchemaForm
                        key={`${controller.path}-instance-${instanceId}`}
                        schema={instanceSchema}
                        initialData={data}
                        onSubmit={handleSubmit}
                        submitButtonText="Save Changes"
                        isLoading={saving}
                    />
                ) : (
                    <div className="text-center text-gray-400">
                        No schema defined for instances
                    </div>
                )}
            </Card>
        </div>
    );
}

export default InstanceEditPage;

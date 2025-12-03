import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, SchemaForm } from '@/components';
import { extractErrorMessage } from '@/lib/errorHandler';
import type { IResourceSchema } from '@/types';

interface InstanceCreatePageProps<T extends { id: number }> {
    controller: PageController<T> & {
        instanceService?: any;
        instanceSchema?: IResourceSchema;
    };
}

function InstanceCreatePage<T extends { id: number }>({
    controller,
}: InstanceCreatePageProps<T>) {
    const instanceService = controller.instanceService;
    const instanceSchema = controller.instanceSchema;
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (data: Record<string, any>) => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await instanceService.createInstance(Number(id), data);
            navigate(`/${controller.path}/${id}`);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    Add{' '}
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
                {instanceSchema ? (
                    <SchemaForm
                        key={controller.path}
                        schema={instanceSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Create Instance"
                        isLoading={loading}
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

export default InstanceCreatePage;

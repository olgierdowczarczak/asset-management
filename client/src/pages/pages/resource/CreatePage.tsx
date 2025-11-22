import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, SchemaForm } from '@/components';
import { extractErrorMessage } from '@/lib/errorHandler';

function CreatePage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleSubmit = async (data: Record<string, any>) => {
        setLoading(true);
        setError(null);

        try {
            await controller.service.create(data as Partial<T>);
            navigate(`/${controller.path}`);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    Create{' '}
                    {controller.resourceName.charAt(0).toUpperCase() +
                        controller.resourceName.slice(1)}
                </h1>
                <Button variant="secondary" onClick={() => navigate(`/${controller.path}`)}>
                    Back to List
                </Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
                    {error}
                </div>
            )}

            <Card className="p-6">
                {controller.schema ? (
                    <SchemaForm
                        key={controller.path}
                        schema={controller.schema}
                        onSubmit={handleSubmit}
                        submitButtonText="Create"
                        isLoading={loading}
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

export default CreatePage;

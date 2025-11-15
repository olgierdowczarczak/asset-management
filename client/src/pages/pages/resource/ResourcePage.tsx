import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, ReferenceLink, CheckInOutModal } from '@/components';
import { getDisplayValue, getCollectionPath } from '@/lib/schemaHelpers';

function ResourcePage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [checkInOutModalOpen, setCheckInOutModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await controller.service.get(Number(id));
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Failed to load resource');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, controller]);

    const handleDelete = async () => {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete this ${controller.resourceName}? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        try {
            await controller.service.delete(Number(id));
            navigate(`/${controller.path}`);
        } catch (err: any) {
            alert(err.message || 'Failed to delete resource');
            setDeleting(false);
        }
    };

    const renderFieldValue = (fieldName: string, value: any, fieldSchema: any) => {
        if (value === undefined || value === null) {
            return <span className="text-gray-500">-</span>;
        }

        switch (fieldSchema.type) {
            case 'boolean':
                return (
                    <span className={value ? 'text-green-400' : 'text-gray-400'}>
                        {value ? 'Yes' : 'No'}
                    </span>
                );

            case 'reference': {
                const collection = fieldSchema.referencedCollection;
                if (!collection) {
                    const displayValue = getDisplayValue(value, fieldSchema.displayField);
                    return <span className="text-blue-400">{displayValue}</span>;
                }
                return (
                    <ReferenceLink
                        value={value}
                        collection={getCollectionPath(collection)}
                        displayField={fieldSchema.displayField}
                    />
                );
            }

            case 'polymorphicReference': {
                const modelField = fieldSchema.modelField;
                if (!modelField) {
                    const displayValue = getDisplayValue(value, fieldSchema.displayField);
                    return <span className="text-blue-400">{displayValue}</span>;
                }
                const collection = data[modelField];
                if (!collection) {
                    const displayValue = getDisplayValue(value, fieldSchema.displayField);
                    return <span className="text-blue-400">{displayValue}</span>;
                }
                return (
                    <ReferenceLink
                        value={value}
                        collection={getCollectionPath(collection)}
                        displayField={fieldSchema.displayField}
                    />
                );
            }

            case 'enum':
                return (
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                        {typeof value === 'string'
                            ? value.charAt(0).toUpperCase() + value.slice(1)
                            : value}
                    </span>
                );

            case 'email':
                return (
                    <a href={`mailto:${value}`} className="text-blue-400 hover:underline">
                        {value}
                    </a>
                );

            default:
                return <span>{value.toString()}</span>;
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-gray-400">Loading...</div>
                </Card>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-red-400">{error || 'Resource not found'}</div>
                </Card>
            </div>
        );
    }

    const isMainAdmin = controller.path === 'users' && id === '1';
    const supportsCheckInOut = ['assets', 'accessories', 'licenses'].includes(controller.path);
    const hasAssignee = data?.assignee;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    {controller.resourceName} Details
                </h1>
                <div className="flex gap-2">
                    {supportsCheckInOut && (
                        <Button onClick={() => setCheckInOutModalOpen(true)} disabled={loading}>
                            {hasAssignee ? 'Check In' : 'Check Out'}
                        </Button>
                    )}
                    {!isMainAdmin && (
                        <>
                            <Button
                                onClick={() => navigate(`/${controller.path}/${id}/edit`)}
                                disabled={deleting}
                            >
                                Edit
                            </Button>
                            <Button variant="secondary" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/${controller.path}`)}
                        disabled={deleting}
                    >
                        Back to List
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                {controller.schema ? (
                    <div className="space-y-4">
                        {Object.entries(controller.schema).map(([fieldName, fieldSchema]) => {
                            if (fieldSchema.showInDetail === false) {
                                return null;
                            }

                            return (
                                <div
                                    key={fieldName}
                                    className="flex border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="w-1/3 text-sm font-medium text-gray-400">
                                        {fieldSchema.label}
                                    </div>
                                    <div className="w-2/3 text-gray-100">
                                        {renderFieldValue(fieldName, data[fieldName], fieldSchema)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        No schema defined for this resource
                    </div>
                )}
            </Card>

            {supportsCheckInOut && (
                <CheckInOutModal
                    isOpen={checkInOutModalOpen}
                    onClose={() => setCheckInOutModalOpen(false)}
                    onSuccess={() => {
                        fetchData();
                    }}
                    resourceId={Number(id)}
                    resourceName={data?.name || controller.resourceName}
                    resourceType={controller.path}
                    currentAssignee={data?.assignee}
                    currentAssigneeModel={data?.assigneeModel}
                />
            )}
        </div>
    );
}

export default ResourcePage;

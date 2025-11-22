import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageController } from '@/core';
import {
    Card,
    Button,
    Modal,
    ReferenceLink,
    CheckInOutModal,
    HistoryModal,
    HistoryList,
} from '@/components';
import { getDisplayValue, getCollectionPath } from '@/lib/schemaHelpers';
import { extractErrorMessage } from '@/lib/errorHandler';
import type { IResourceSchema } from '@/types';

interface InstanceMasterPageProps<T extends { id: number }> {
    controller: PageController<T> & {
        instanceService?: any;
        instanceSchema?: IResourceSchema;
    };
}

function InstanceMasterPage<T extends { id: number }>({ controller }: InstanceMasterPageProps<T>) {
    const instanceService = controller.instanceService;
    const instanceSchema = controller.instanceSchema;
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [instances, setInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [instancesLoading, setInstancesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [checkInOutModalOpen, setCheckInOutModalOpen] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<any>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const navigate = useNavigate();

    if (!instanceService || !instanceSchema) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center text-red-400 p-8">
                    This controller is not configured for instance management.
                </div>
            </div>
        );
    }

    const fetchData = async () => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await controller.service.get(Number(id));
            setData(result);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const fetchInstances = async (page: number = 1) => {
        if (!id) {
            return;
        }

        setInstancesLoading(true);
        try {
            const response = await instanceService.getInstances(Number(id), page, pagination.limit);
            setInstances(response.data.items || []);
            setPagination(response.data.pagination);
        } catch (err: unknown) {
        } finally {
            setInstancesLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, controller]);

    useEffect(() => {
        if (data) {
            fetchInstances();
        }
    }, [data]);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!id) {
            return;
        }

        setDeleting(true);
        setDeleteModalOpen(false);
        try {
            await controller.service.delete(Number(id));
            navigate(`/${controller.path}`);
        } catch (err: unknown) {
            setDeleting(false);
        }
    };

    const handleCheckInOutClick = (instance: any) => {
        setSelectedInstance(instance);
        setCheckInOutModalOpen(true);
    };

    const handleCheckInOutSuccess = async () => {
        await fetchInstances(pagination.page);
        setCheckInOutModalOpen(false);
        setSelectedInstance(null);
    };

    const renderFieldValue = (fieldName: string, value: any, fieldSchema: any, rowData?: any) => {
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
                const sourceData = rowData || data;
                const collection = sourceData[modelField];
                if (!collection) {
                    const displayValue = getDisplayValue(value, fieldSchema.displayField);
                    return <span className="text-blue-400">{displayValue}</span>;
                }
                const actualCollection =
                    collection === 'common' ? sourceData['actualAssigneeModel'] : collection;
                if (!actualCollection) {
                    return <span className="text-gray-500">-</span>;
                }
                return (
                    <ReferenceLink
                        value={value}
                        collection={getCollectionPath(actualCollection)}
                        displayField={fieldSchema.displayField}
                    />
                );
            }

            case 'enum':
                return (
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                        {typeof value === 'string'
                            ? value
                                  .split('_')
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')
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
                if (fieldName === 'assignedAt' && value) {
                    return <span>{new Date(value).toLocaleString()}</span>;
                }
                return <span>{value.toString()}</span>;
        }
    };

    const renderInstanceRow = (instance: any) => {
        return (
            <tr key={instance.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                {Object.entries(instanceSchema).map(([fieldName, fieldSchema]) => {
                    if (fieldSchema.showInTable === false) {
                        return null;
                    }

                    return (
                        <td key={fieldName} className="px-4 py-3 text-gray-300">
                            {renderFieldValue(
                                fieldName,
                                instance[fieldName],
                                fieldSchema,
                                instance,
                            )}
                        </td>
                    );
                })}
                <td className="px-4 py-3">
                    <Button size="sm" onClick={() => handleCheckInOutClick(instance)}>
                        {instance.assignee ? 'Check In' : 'Check Out'}
                    </Button>
                </td>
            </tr>
        );
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-gray-400">Loading...</div>
                </Card>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-red-400">{error || 'Resource not found'}</div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    {controller.resourceName.charAt(0).toUpperCase() +
                        controller.resourceName.slice(1)}
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate(`/${controller.path}/${id}/edit`)}
                        disabled={deleting}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setHistoryModalOpen(true)}
                        disabled={loading}
                    >
                        History
                    </Button>
                    <Button variant="secondary" onClick={handleDeleteClick} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/${controller.path}`)}
                        disabled={deleting}
                    >
                        Back to List
                    </Button>
                </div>
            </div>

            <Card className="p-6 mb-6">
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

            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Individual Items</h2>
                {instancesLoading ? (
                    <div className="text-center text-gray-400 py-8">Loading items...</div>
                ) : instances.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No items found</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        {Object.entries(instanceSchema).map(
                                            ([fieldName, fieldSchema]) => {
                                                if (fieldSchema.showInTable === false) {
                                                    return null;
                                                }
                                                return (
                                                    <th
                                                        key={fieldName}
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-400"
                                                    >
                                                        {fieldSchema.label}
                                                    </th>
                                                );
                                            },
                                        )}
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instances.map((instance) => renderInstanceRow(instance))}
                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Page {pagination.page} of {pagination.totalPages} (
                                    {pagination.total} total)
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => fetchInstances(pagination.page - 1)}
                                        disabled={pagination.page <= 1 || instancesLoading}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => fetchInstances(pagination.page + 1)}
                                        disabled={
                                            pagination.page >= pagination.totalPages ||
                                            instancesLoading
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to delete this {controller.resourceName}?
                    </p>
                    <p className="text-sm text-gray-400">This action cannot be undone.</p>
                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <HistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                resourceType={controller.path}
                resourceId={Number(id)}
                resourceName={data?.name || controller.resourceName}
            />

            {selectedInstance && (
                <CheckInOutModal
                    isOpen={checkInOutModalOpen}
                    onClose={() => {
                        setCheckInOutModalOpen(false);
                        setSelectedInstance(null);
                    }}
                    onSuccess={handleCheckInOutSuccess}
                    resourceId={selectedInstance.id}
                    resourceName={`${data?.name} #${selectedInstance.instanceNumber}`}
                    resourceType={`${controller.path}-instances`}
                    currentAssignee={selectedInstance.assignee}
                    currentAssigneeModel={selectedInstance.assigneeModel}
                    currentActualAssigneeModel={selectedInstance.actualAssigneeModel}
                    instanceMode={true}
                    parentId={Number(id)}
                />
            )}

            <div className="mt-6">
                <HistoryList resourceType={controller.path} resourceId={Number(id)} />
            </div>
        </div>
    );
}

export default InstanceMasterPage;

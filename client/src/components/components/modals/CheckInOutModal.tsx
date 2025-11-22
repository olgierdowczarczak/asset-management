import { useState, useEffect } from 'react';
import { Modal, SearchableSelect, Button, Label } from '@/components';
import { client } from '@/api';
import { getDisplayValue } from '@/lib/schemaHelpers';
import { extractErrorMessage } from '@/lib/errorHandler';

interface CheckInOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    resourceId: number;
    resourceName: string;
    resourceType: string;
    currentAssignee?: any;
    currentAssigneeModel?: string;
    currentActualAssigneeModel?: string;
    instanceMode?: boolean;
    parentId?: number;
}

const CheckInOutModal = ({
    isOpen,
    onClose,
    onSuccess,
    resourceId,
    resourceName,
    resourceType,
    currentAssignee,
    currentAssigneeModel,
    currentActualAssigneeModel,
    instanceMode = false,
    parentId,
}: CheckInOutModalProps) => {
    const [selectedAssignee, setSelectedAssignee] = useState<number | string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isCheckIn = !!currentAssignee;
    const assigneeType = (currentAssigneeModel as 'users' | 'locations' | 'common') || 'common';
    const isCommon = assigneeType === 'common';

    useEffect(() => {
        if (isOpen) {
            loadOptions();
        }
    }, [isOpen]);

    const loadOptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, locationsRes] = await Promise.all([
                client.get('/users/', { params: { limit: 1000 } }),
                client.get('/locations/', { params: { limit: 1000 } }),
            ]);
            setUsers(usersRes.data?.items || usersRes.data || []);
            setLocations(locationsRes.data?.items || locationsRes.data || []);
        } catch (error: any) {
            const message = extractErrorMessage(error);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (isCheckIn) {
            await handleCheckIn();
        } else {
            if (!selectedAssignee) {
                return;
            }
            await handleCheckOut();
        }
    };

    const handleCheckIn = async () => {
        setSubmitting(true);
        setError(null);
        try {
            let url: string;
            if (instanceMode && parentId) {
                const parentType = resourceType.replace('-instances', '');
                url = `/${parentType}/${parentId}/instances/${resourceId}/checkin`;
            } else {
                url = `/${resourceType}/${resourceId}/checkin`;
            }
            await client.post(url);
            await Promise.resolve(onSuccess());
            onClose();
        } catch (error: any) {
            const message = extractErrorMessage(error);
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckOut = async () => {
        setSubmitting(true);
        setError(null);
        try {
            let payload: any = {};

            if (isCommon) {
                const [type, id] = String(selectedAssignee).split(':');
                payload = {
                    assigneeModel: 'common',
                    actualAssigneeModel: type,
                    assignee: Number(id),
                };
            } else {
                payload = {
                    assigneeModel: assigneeType,
                    actualAssigneeModel: assigneeType,
                    assignee: Number(selectedAssignee),
                };
            }

            let url: string;
            if (instanceMode && parentId) {
                const parentType = resourceType.replace('-instances', '');
                url = `/${parentType}/${parentId}/instances/${resourceId}/checkout`;
            } else {
                url = `/${resourceType}/${resourceId}/checkout`;
            }

            await client.post(url, payload);
            await Promise.resolve(onSuccess());
            onClose();
        } catch (error: any) {
            const message = extractErrorMessage(error);
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const actualType = isCommon ? currentActualAssigneeModel : assigneeType;
    const displayField = actualType === 'users' ? 'fullName' : 'name';
    const formattedOptions = isCommon
        ? [
              ...users.map((item) => ({
                  value: `users:${item.id}`,
                  label: `User: ${getDisplayValue(item, 'fullName')}`,
              })),
              ...locations.map((item) => ({
                  value: `locations:${item.id}`,
                  label: `Location: ${getDisplayValue(item, 'name')}`,
              })),
          ]
        : (assigneeType === 'users' ? users : locations).map((item) => ({
              value: item.id,
              label: getDisplayValue(item, assigneeType === 'users' ? 'fullName' : 'name'),
          }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isCheckIn ? `Check In ${resourceName}` : `Check Out ${resourceName}`}
            size="lg"
        >
            <div className="space-y-4">
                {isCheckIn ? (
                    <div>
                        <p className="text-gray-300 mb-4">
                            Currently assigned to:{' '}
                            <span className="text-blue-400 font-semibold">
                                {getDisplayValue(currentAssignee, displayField)}
                            </span>
                        </p>
                        <p className="text-gray-400 text-sm">
                            Click "Check In" to return this {resourceType.slice(0, -1)} and make it
                            available.
                        </p>
                    </div>
                ) : (
                    <div>
                        <Label required>
                            {isCommon
                                ? 'Select User or Location'
                                : `Select ${assigneeType === 'users' ? 'User' : 'Location'}`}
                        </Label>
                        <SearchableSelect
                            value={selectedAssignee}
                            onChange={setSelectedAssignee}
                            options={formattedOptions}
                            placeholder={
                                isCommon
                                    ? 'Search users or locations...'
                                    : `Search ${assigneeType === 'users' ? 'users' : 'locations'}...`
                            }
                            disabled={loading}
                            required
                        />
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={submitting || loading}>
                        {submitting
                            ? isCheckIn
                                ? 'Checking In...'
                                : 'Checking Out...'
                            : isCheckIn
                              ? 'Check In'
                              : 'Check Out'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CheckInOutModal;

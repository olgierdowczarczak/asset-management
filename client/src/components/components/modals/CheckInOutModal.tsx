import { useState, useEffect } from 'react';
import { Modal, SearchableSelect, Button, Label } from '@/components';
import { client } from '@/api';
import { getDisplayValue } from '@/lib/schemaHelpers';

interface CheckInOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    resourceId: number;
    resourceName: string;
    resourceType: string;
    currentAssignee?: any;
    currentAssigneeModel?: string;
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
}: CheckInOutModalProps) => {
    const [selectedAssignee, setSelectedAssignee] = useState<number | string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const isCheckIn = !!currentAssignee;
    const assigneeType = (currentAssigneeModel as 'users' | 'locations') || 'users';

    useEffect(() => {
        if (isOpen) {
            loadOptions();
        }
    }, [isOpen]);

    const loadOptions = async () => {
        setLoading(true);
        try {
            const [usersRes, locationsRes] = await Promise.all([
                client.get('/users/', { params: { limit: 1000 } }),
                client.get('/locations/', { params: { limit: 1000 } }),
            ]);
            setUsers(usersRes.data?.items || usersRes.data || []);
            setLocations(locationsRes.data?.items || locationsRes.data || []);
        } catch (error) {
            console.error('Failed to load options:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (isCheckIn) {
            await handleCheckIn();
        } else {
            if (!selectedAssignee) {
                alert('Please select a user or location');
                return;
            }
            await handleCheckOut();
        }
    };

    const handleCheckIn = async () => {
        setSubmitting(true);
        try {
            await client.patch(`/${resourceType}/${resourceId}`, {
                assigneeModel: undefined,
                assignee: undefined,
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to check in');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckOut = async () => {
        setSubmitting(true);
        try {
            await client.patch(`/${resourceType}/${resourceId}`, {
                assigneeModel: assigneeType,
                assignee: Number(selectedAssignee),
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to check out');
        } finally {
            setSubmitting(false);
        }
    };

    const options = assigneeType === 'users' ? users : locations;
    const displayField = assigneeType === 'users' ? 'fullName' : 'name';

    const formattedOptions = options.map((item) => ({
        value: item.id,
        label: getDisplayValue(item, displayField),
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
                            Select {assigneeType === 'users' ? 'User' : 'Location'}
                        </Label>
                        <SearchableSelect
                            value={selectedAssignee}
                            onChange={setSelectedAssignee}
                            options={formattedOptions}
                            placeholder={`Search ${assigneeType === 'users' ? 'users' : 'locations'}...`}
                            disabled={loading}
                            required
                        />
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

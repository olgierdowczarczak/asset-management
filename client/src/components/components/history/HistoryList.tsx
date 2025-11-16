import { useEffect, useState } from 'react';
import { client } from '@/api';
import { Card } from '@/components';

interface HistoryEntry {
    id: number;
    resourceType: string;
    resourceId: number;
    action: string;
    performedBy?: number;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
    timestamp: string;
}

interface HistoryListProps {
    resourceType: string;
    resourceId: number;
    limit?: number;
    showTitle?: boolean;
}

const HistoryList = ({
    resourceType,
    resourceId,
    limit = 5,
    showTitle = true,
}: HistoryListProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, [resourceType, resourceId, limit]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.get(`/history/resource/${resourceType}/${resourceId}`, {
                params: { limit },
            });
            setHistory(response.data?.items || []);
            setTotal(response.data?.pagination?.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const formatAction = (action: string): string => {
        const actionMap: Record<string, string> = {
            created: 'Created',
            updated: 'Updated',
            checkin: 'Checked In',
            checkout: 'Checked Out',
            deleted: 'Deleted',
        };
        return actionMap[action] || action;
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionColor = (action: string): string => {
        const colorMap: Record<string, string> = {
            created: 'text-green-400',
            updated: 'text-blue-400',
            checkin: 'text-yellow-400',
            checkout: 'text-purple-400',
            deleted: 'text-red-400',
        };
        return colorMap[action] || 'text-gray-400';
    };

    const getActionSummary = (entry: HistoryEntry): string => {
        if (!entry.metadata) return '';

        switch (entry.action) {
            case 'created':
                return `Created ${entry.metadata.name || 'item'}`;
            case 'updated':
                return `Updated ${entry.metadata.name || 'item'}`;
            case 'checkout':
                if (entry.metadata.assigneeName) {
                    const model =
                        entry.metadata.assigneeModel === 'common'
                            ? entry.metadata.actualAssigneeModel
                            : entry.metadata.assigneeModel;
                    const type = model === 'users' ? 'User' : 'Location';
                    return `Checked out to ${type}: ${entry.metadata.assigneeName}`;
                } else if (entry.metadata.assigneeId) {
                    const model =
                        entry.metadata.assigneeModel === 'common'
                            ? entry.metadata.actualAssigneeModel
                            : entry.metadata.assigneeModel;
                    const type = model === 'users' ? 'User' : 'Location';
                    return `Checked out to ${type} (ID: ${entry.metadata.assigneeId})`;
                }
                return 'Checked out';
            case 'checkin':
                if (entry.metadata.previousAssigneeName) {
                    const type =
                        entry.metadata.previousAssigneeModel === 'users' ||
                        entry.metadata.previousActualAssigneeModel === 'users'
                            ? 'User'
                            : 'Location';
                    return `Checked in from ${type}: ${entry.metadata.previousAssigneeName}`;
                } else if (entry.metadata.previousAssignee) {
                    const type =
                        entry.metadata.previousAssigneeModel === 'users' ||
                        entry.metadata.previousActualAssigneeModel === 'users'
                            ? 'User'
                            : 'Location';
                    return `Checked in from ${type} (ID: ${entry.metadata.previousAssignee})`;
                }
                return 'Checked in';
            case 'deleted':
                return `Deleted ${entry.metadata.name || 'item'}`;
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-400">Loading history...</div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center text-red-400">{error}</div>
            </Card>
        );
    }

    if (history.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-400">No history entries found</div>
            </Card>
        );
    }

    const hasMore = total > history.length;

    return (
        <Card className="p-6">
            {showTitle && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Recent History</h3>
                    {hasMore && (
                        <span className="text-sm text-gray-400">
                            Showing {history.length} of {total}
                        </span>
                    )}
                </div>
            )}
            <div className="space-y-4">
                {history.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-gray-700 pl-4 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`font-semibold ${getActionColor(entry.action)} cursor-help`}
                                title={getActionSummary(entry)}
                            >
                                {formatAction(entry.action)}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {formatTimestamp(entry.timestamp)}
                            </span>
                        </div>

                        {entry.metadata && (
                            <div className="text-sm text-gray-400 mt-1">
                                {entry.action === 'checkout' && entry.metadata.assigneeName && (
                                    <div>
                                        Assigned to:{' '}
                                        <span className="text-gray-300">
                                            {(entry.metadata.assigneeModel === 'common'
                                                ? entry.metadata.actualAssigneeModel
                                                : entry.metadata.assigneeModel) === 'users'
                                                ? 'User'
                                                : 'Location'}
                                            : {entry.metadata.assigneeName}
                                        </span>
                                    </div>
                                )}
                                {entry.action === 'checkin' &&
                                    entry.metadata.previousAssigneeName && (
                                        <div>
                                            Returned from:{' '}
                                            <span className="text-gray-300">
                                                {entry.metadata.previousAssigneeModel === 'users' ||
                                                entry.metadata.previousActualAssigneeModel ===
                                                    'users'
                                                    ? 'User'
                                                    : 'Location'}
                                                : {entry.metadata.previousAssigneeName}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HistoryList;

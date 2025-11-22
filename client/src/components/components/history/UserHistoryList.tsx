import { useEffect, useState } from 'react';
import { client } from '@/api';
import { Card } from '@/components';
import { extractErrorMessage } from '@/lib/errorHandler';

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

interface UserHistoryListProps {
    userId: number;
    limit?: number;
}

const UserHistoryList = ({ userId, limit = 5 }: UserHistoryListProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, [userId, limit]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.get(`/history/user/${userId}`, {
                params: { limit },
            });
            setHistory(response.data?.items || []);
            setTotal(response.data?.pagination?.total || 0);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
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

    const formatResourceType = (type: string): string => {
        const typeMap: Record<string, string> = {
            assets: 'Asset',
            accessories: 'Accessory',
            licenses: 'License',
            users: 'User',
            companies: 'Company',
            departments: 'Department',
            locations: 'Location',
        };
        return typeMap[type] || type;
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

    const getActionDescription = (entry: HistoryEntry): string => {
        const resourceName =
            entry.metadata?.name ||
            `${formatResourceType(entry.resourceType)} #${entry.resourceId}`;

        switch (entry.action) {
            case 'checkout':
                if (entry.metadata?.assigneeId === userId) {
                    return `${resourceName} was assigned to you`;
                }
                return `${resourceName} was checked out`;
            case 'checkin':
                if (entry.metadata?.previousAssignee === userId) {
                    return `${resourceName} was returned from you`;
                }
                return `${resourceName} was checked in`;
            case 'created':
                return `${resourceName} was created`;
            case 'updated':
                return `${resourceName} was updated`;
            case 'deleted':
                return `${resourceName} was deleted`;
            default:
                return `${resourceName} - ${entry.action}`;
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-400">Loading activity history...</div>
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
                <div className="text-center text-gray-400">No activity history found</div>
            </Card>
        );
    }

    const hasMore = total > history.length;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Recent Related Activity</h3>
                {hasMore && (
                    <span className="text-sm text-gray-400">
                        Showing {history.length} of {total}
                    </span>
                )}
            </div>
            <div className="space-y-4">
                {history.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-gray-700 pl-4 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold ${getActionColor(entry.action)}`}>
                                {formatAction(entry.action)}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {formatTimestamp(entry.timestamp)}
                            </span>
                        </div>

                        <div className="text-sm text-gray-300">{getActionDescription(entry)}</div>

                        <div className="text-xs text-gray-500 mt-1">
                            {formatResourceType(entry.resourceType)} ID: {entry.resourceId}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default UserHistoryList;

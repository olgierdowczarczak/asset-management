import { useEffect, useState } from 'react';
import { HistoryServiceInstance } from '@/services';
import { Card, Button } from '@/components';
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

interface HistoryTableProps {
    limit?: number;
    showPagination?: boolean;
    showSearch?: boolean;
}

const HistoryTable = ({
    limit = 50,
    showPagination = true,
    showSearch = true,
}: HistoryTableProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchResourceType, setSearchResourceType] = useState('');
    const [searchResourceId, setSearchResourceId] = useState('');

    useEffect(() => {
        loadHistory();
    }, [currentPage, limit]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = { page: currentPage, limit };

            if (searchResourceType) {
                params.resourceType = searchResourceType;
            }
            if (searchResourceId) {
                params.resourceId = parseInt(searchResourceId);
            }

            const response = await HistoryServiceInstance.getAll(params);
            setHistory(response?.items || []);
            setTotal(response?.pagination?.total || 0);
            setTotalPages(response?.pagination?.totalPages || 1);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadHistory();
    };

    const handleClearSearch = () => {
        setSearchResourceType('');
        setSearchResourceId('');
        setCurrentPage(1);
        setTimeout(() => loadHistory(), 0);
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

    const formatResourceType = (resourceType: string): string => {
        const typeMap: Record<string, string> = {
            assets: 'Asset',
            accessories: 'Accessory',
            licenses: 'License',
            'accessory-instances': 'Accessory Instance',
            'license-instances': 'License Instance',
            users: 'User',
            companies: 'Company',
            departments: 'Department',
            locations: 'Location',
            jobtitles: 'Job Title',
            seniorities: 'Seniority',
        };
        return typeMap[resourceType] || resourceType;
    };

    const getActionDetails = (entry: HistoryEntry): string => {
        if (!entry.metadata) return '';

        switch (entry.action) {
            case 'created':
                return entry.metadata.name ? `Created "${entry.metadata.name}"` : 'Created';
            case 'updated':
                return entry.metadata.name ? `Updated "${entry.metadata.name}"` : 'Updated';
            case 'checkout':
                if (entry.metadata.assigneeName) {
                    const model =
                        entry.metadata.assigneeModel === 'common'
                            ? entry.metadata.actualAssigneeModel
                            : entry.metadata.assigneeModel;
                    const type = model === 'users' ? 'User' : 'Location';
                    return `Checked out to ${type}: ${entry.metadata.assigneeName}`;
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
                }
                return 'Checked in';
            case 'deleted':
                return entry.metadata.name ? `Deleted "${entry.metadata.name}"` : 'Deleted';
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

    return (
        <div className="space-y-6">
            {showSearch && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Search History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resource Type
                            </label>
                            <select
                                value={searchResourceType}
                                onChange={(e) => setSearchResourceType(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="assets">Assets</option>
                                <option value="accessories">Accessories</option>
                                <option value="licenses">Licenses</option>
                                <option value="users">Users</option>
                                <option value="companies">Companies</option>
                                <option value="departments">Departments</option>
                                <option value="locations">Locations</option>
                                <option value="jobtitles">Job Titles</option>
                                <option value="seniorities">Seniorities</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resource ID
                            </label>
                            <input
                                type="number"
                                value={searchResourceId}
                                onChange={(e) => setSearchResourceId(e.target.value)}
                                placeholder="Enter ID"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={handleSearch} className="flex-1">
                                Search
                            </Button>
                            <Button onClick={handleClearSearch} variant="secondary">
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">
                        History ({total} entries)
                    </h3>
                </div>

                {history.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No history entries found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Resource Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Resource ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {history.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm text-gray-300">
                                            {formatTimestamp(entry.timestamp)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`font-semibold ${getActionColor(entry.action)}`}
                                            >
                                                {formatAction(entry.action)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">
                                            {formatResourceType(entry.resourceType)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">
                                            {entry.resourceId}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">
                                            {getActionDetails(entry)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4 mt-4">
                        <div className="text-sm text-gray-400">
                            Showing {(currentPage - 1) * limit + 1} to{' '}
                            {Math.min(currentPage * limit, total)} of {total} results
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage <= 1}
                            >
                                Previous
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded border transition-colors ${
                                            page === currentPage
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage >= totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default HistoryTable;

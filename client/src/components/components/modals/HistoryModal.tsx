import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/components';
import { client } from '@/api';

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

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceType: string;
    resourceId: number;
    resourceName: string;
}

const HistoryModal = ({
    isOpen,
    onClose,
    resourceType,
    resourceId,
    resourceName,
}: HistoryModalProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen, page, resourceType, resourceId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const response = await client.get(`/history/resource/${resourceType}/${resourceId}`, {
                params: { page, limit },
            });
            setHistory(response.data?.items || []);
            setTotal(response.data?.pagination?.total || 0);
            setTotalPages(response.data?.pagination?.totalPages || 1);
        } catch (err) {
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

    const filteredHistory = searchTerm
        ? history.filter((entry) => {
              const searchLower = searchTerm.toLowerCase();
              return (
                  formatAction(entry.action).toLowerCase().includes(searchLower) ||
                  entry.metadata?.name?.toLowerCase().includes(searchLower) ||
                  formatTimestamp(entry.timestamp).includes(searchLower)
              );
          })
        : history;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`History: ${resourceName}`} size="2xl">
            <div className="space-y-4">
                <div>
                    <Input
                        type="text"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-8">Loading...</div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        {searchTerm ? 'No matching history entries' : 'No history entries found'}
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredHistory.map((entry) => (
                            <div
                                key={entry.id}
                                className="border border-gray-700 rounded p-4 hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`font-semibold ${getActionColor(entry.action)}`}
                                    >
                                        {formatAction(entry.action)}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {formatTimestamp(entry.timestamp)}
                                    </span>
                                </div>

                                {entry.metadata && (
                                    <div className="text-sm text-gray-400 mt-1">
                                        {entry.action === 'checkout' &&
                                            entry.metadata.assigneeId && (
                                                <div>
                                                    Assigned to:{' '}
                                                    <span className="text-gray-300">
                                                        {entry.metadata.assigneeModel === 'users' ||
                                                        entry.metadata.actualAssigneeModel ===
                                                            'users'
                                                            ? 'User'
                                                            : 'Location'}{' '}
                                                        ID: {entry.metadata.assigneeId}
                                                    </span>
                                                </div>
                                            )}
                                        {entry.action === 'checkin' &&
                                            entry.metadata.previousAssignee && (
                                                <div>
                                                    Returned from:{' '}
                                                    <span className="text-gray-300">
                                                        {entry.metadata.previousAssigneeModel ===
                                                            'users' ||
                                                        entry.metadata
                                                            .previousActualAssigneeModel === 'users'
                                                            ? 'User'
                                                            : 'Location'}{' '}
                                                        ID: {entry.metadata.previousAssignee}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!searchTerm && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                            Page {page} of {totalPages} ({total} total entries)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default HistoryModal;

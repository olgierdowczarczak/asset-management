import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageController } from '@/core';
import { Card, Button, Input, SchemaTable } from '@/components';
import { getDisplayValue } from '@/lib/schemaHelpers';

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

function MainPage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (isMounted) {
                setLoading(true);
            }

            try {
                const result = await controller.service.getAll(currentPage, 10);
                if (isMounted) {
                    setData(result.items || []);
                    setPagination(result.pagination || null);
                }
            } catch (error) {
                if (isMounted) {
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [controller, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredData = data.filter((item: any) => {
        if (!search) {
            return true;
        }

        const searchLower = search.toLowerCase();
        return Object.entries(item).some(([_key, value]) => {
            if (value === null || value === undefined) {
                return false;
            }

            if (typeof value === 'object' && 'id' in value) {
                const displayValue = getDisplayValue(value as any);
                return displayValue.toLowerCase().includes(searchLower);
            }
            return value.toString().toLowerCase().includes(searchLower);
        });
    });

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">{controller.resourceName}</h1>
                <Button onClick={() => navigate(`/${controller.path}/create`)}>Add New</Button>
            </div>

            <Card className="mb-6 p-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </Card>

            <Card>
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : controller.schema ? (
                    <>
                        <SchemaTable
                            schema={controller.schema}
                            data={filteredData}
                            onRowClick={(row) => navigate(`/${controller.path}/${row.id}`)}
                        />
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
                                <div className="text-sm text-gray-400">
                                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                                    of {pagination.total} results
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                        disabled={!pagination.hasPrev}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex gap-1">
                                        {Array.from(
                                            { length: pagination.totalPages },
                                            (_, i) => i + 1,
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 rounded border transition-colors ${
                                                    page === pagination.page
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
                                        disabled={!pagination.hasNext}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        No schema defined for this resource
                    </div>
                )}
            </Card>
        </div>
    );
}

export default MainPage;

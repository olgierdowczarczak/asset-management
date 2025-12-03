import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AssetService,
    AccessoryInstanceService,
    LicenseInstanceService,
    HistoryServiceInstance,
} from '@/services';
import { StatisticsChart, Card, Button } from '@/components';
import config from '@/config';

interface Asset {
    id: number;
    name: string;
    assignee?: number | object;
}

interface ChartData {
    name: string;
    value: number;
    count: number;
    [key: string]: string | number;
}

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

function HomePage() {
    const navigate = useNavigate();
    const [assetsData, setAssetsData] = useState<ChartData[]>([]);
    const [accessoriesData, setAccessoriesData] = useState<ChartData[]>([]);
    const [licensesData, setLicensesData] = useState<ChartData[]>([]);
    const [recentHistory, setRecentHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllPages = async (service: typeof AssetService) => {
        const allItems: any[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await service.getAll(page, 100);
            if (response?.items) {
                allItems.push(...response.items);
            }
            hasMore = response?.pagination?.hasNext || false;
            page++;
        }

        return allItems;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const assets = await fetchAllPages(AssetService);
                const assignedAssets = assets.filter((asset: Asset) => asset.assignee);
                const unassignedAssets = assets.filter((asset: Asset) => !asset.assignee);
                const assetsTotal = assets.length;
                const assetsStats =
                    assetsTotal > 0
                        ? [
                              {
                                  name: 'Unassigned',
                                  value: Math.round((unassignedAssets.length / assetsTotal) * 100),
                                  count: unassignedAssets.length,
                              },
                              {
                                  name: 'Assigned',
                                  value: Math.round((assignedAssets.length / assetsTotal) * 100),
                                  count: assignedAssets.length,
                              },
                          ].filter((item) => item.count > 0)
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setAssetsData(assetsStats);

                const accessoryStats = await AccessoryInstanceService.getStats();
                const assignedQty = accessoryStats.data?.assigned || 0;
                const unassignedQty = accessoryStats.data?.unassigned || 0;
                const totalQty = accessoryStats.data?.total || 0;

                const accessoriesStats =
                    totalQty > 0
                        ? [
                              {
                                  name: 'Unassigned',
                                  value: Math.round((unassignedQty / totalQty) * 100),
                                  count: unassignedQty,
                              },
                              {
                                  name: 'Assigned',
                                  value: Math.round((assignedQty / totalQty) * 100),
                                  count: assignedQty,
                              },
                          ].filter((item) => item.count > 0)
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setAccessoriesData(accessoriesStats);

                const licenseStats = await LicenseInstanceService.getStats();
                const assignedLicenseQty = licenseStats.data?.assigned || 0;
                const unassignedLicenseQty = licenseStats.data?.unassigned || 0;
                const totalLicenseQty = licenseStats.data?.total || 0;

                const licensesStats =
                    totalLicenseQty > 0
                        ? [
                              {
                                  name: 'Unassigned',
                                  value: Math.round((unassignedLicenseQty / totalLicenseQty) * 100),
                                  count: unassignedLicenseQty,
                              },
                              {
                                  name: 'Assigned',
                                  value: Math.round((assignedLicenseQty / totalLicenseQty) * 100),
                                  count: assignedLicenseQty,
                              },
                          ].filter((item) => item.count > 0)
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setLicensesData(licensesStats);

                const historyResponse = await HistoryServiceInstance.getAll({ page: 1, limit: 10 });
                setRecentHistory(historyResponse?.items || []);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                return entry.metadata.name ? `${entry.metadata.name}` : '';
            case 'updated':
                return entry.metadata.name ? `${entry.metadata.name}` : '';
            case 'checkout':
                if (entry.metadata.assigneeName) {
                    const model =
                        entry.metadata.assigneeModel === 'common'
                            ? entry.metadata.actualAssigneeModel
                            : entry.metadata.assigneeModel;
                    const type = model === 'users' ? 'User' : 'Location';
                    return `to ${type}: ${entry.metadata.assigneeName}`;
                }
                return '';
            case 'checkin':
                if (entry.metadata.previousAssigneeName) {
                    const type =
                        entry.metadata.previousAssigneeModel === 'users' ||
                        entry.metadata.previousActualAssigneeModel === 'users'
                            ? 'User'
                            : 'Location';
                    return `from ${type}: ${entry.metadata.previousAssigneeName}`;
                }
                return '';
            case 'deleted':
                return entry.metadata.name ? `${entry.metadata.name}` : '';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-100 mb-6">
                    Welcome to Asset Management
                </h1>
                <div className="text-gray-400">Loading statistics...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-100">Welcome to Asset Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <StatisticsChart title="Assets Statistics" data={assetsData} />
                <StatisticsChart title="Accessories Statistics" data={accessoriesData} />
                <StatisticsChart title="Licenses Statistics" data={licensesData} />
            </div>

            <div className="mt-12">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-100">Recent Activity</h2>
                        <Button onClick={() => navigate(`/${config.routes.history}`)}>
                            View All History
                        </Button>
                    </div>

                    {recentHistory.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">No recent activity</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {recentHistory.map((entry) => (
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
                </Card>
            </div>
        </div>
    );
}

export default HomePage;

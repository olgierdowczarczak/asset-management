import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AssetService, AccessorieService, LicenseService } from '@/services';
import Card from '@/components/ui/Card';

interface Asset {
    id: number;
    name: string;
    assignee?: number | object;
}

interface Accessory {
    id: number;
    name: string;
    quantity: number;
    assignee?: number | object;
}

interface License {
    id: number;
    name: string;
    quantity: number;
    assignee?: number | object;
}

const COLORS = {
    assigned: '#ef4444',
    unassigned: '#10b981',
    noData: '#6b7280',
};

interface ChartData {
    name: string;
    value: number;
    count: number;
}

function HomePage() {
    const [assetsData, setAssetsData] = useState<ChartData[]>([]);
    const [accessoriesData, setAccessoriesData] = useState<ChartData[]>([]);
    const [licensesData, setLicensesData] = useState<ChartData[]>([]);
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
                          ]
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setAssetsData(assetsStats);

                const accessories = await fetchAllPages(AccessorieService);

                let assignedQty = 0;
                let unassignedQty = 0;

                accessories.forEach((accessory: Accessory) => {
                    if (accessory.assignee) {
                        assignedQty += accessory.quantity || 0;
                    } else {
                        unassignedQty += accessory.quantity || 0;
                    }
                });

                const totalQty = assignedQty + unassignedQty;
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
                          ]
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setAccessoriesData(accessoriesStats);

                const licenses = await fetchAllPages(LicenseService);

                let assignedLicenseQty = 0;
                let unassignedLicenseQty = 0;

                licenses.forEach((license: License) => {
                    if (license.assignee) {
                        assignedLicenseQty += license.quantity || 0;
                    } else {
                        unassignedLicenseQty += license.quantity || 0;
                    }
                });

                const totalLicenseQty = assignedLicenseQty + unassignedLicenseQty;
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
                          ]
                        : [
                              {
                                  name: 'No data',
                                  value: 100,
                                  count: 0,
                              },
                          ];

                setLicensesData(licensesStats);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">Assets Statistics</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={assetsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ value }) => `${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                startAngle={180}
                                endAngle={-180}
                            >
                                {assetsData.length === 1 && assetsData[0].name === 'No data' ? (
                                    <Cell fill={COLORS.noData} />
                                ) : (
                                    <>
                                        <Cell fill={COLORS.unassigned} />
                                        <Cell fill={COLORS.assigned} />
                                    </>
                                )}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend
                                formatter={(value, entry: any) =>
                                    value === 'No data'
                                        ? value
                                        : `${value} - ${entry.payload.count}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                        Accessories Statistics
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={accessoriesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ value }) => `${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                startAngle={180}
                                endAngle={-180}
                            >
                                {accessoriesData.length === 1 &&
                                accessoriesData[0].name === 'No data' ? (
                                    <Cell fill={COLORS.noData} />
                                ) : (
                                    <>
                                        <Cell fill={COLORS.unassigned} />
                                        <Cell fill={COLORS.assigned} />
                                    </>
                                )}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend
                                formatter={(value, entry: any) =>
                                    value === 'No data'
                                        ? value
                                        : `${value} - ${entry.payload.count}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                        Licenses Statistics
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={licensesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ value }) => `${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                startAngle={180}
                                endAngle={-180}
                            >
                                {licensesData.length === 1 && licensesData[0].name === 'No data' ? (
                                    <Cell fill={COLORS.noData} />
                                ) : (
                                    <>
                                        <Cell fill={COLORS.unassigned} />
                                        <Cell fill={COLORS.assigned} />
                                    </>
                                )}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend
                                formatter={(value, entry: any) =>
                                    value === 'No data'
                                        ? value
                                        : `${value} - ${entry.payload.count}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}

export default HomePage;

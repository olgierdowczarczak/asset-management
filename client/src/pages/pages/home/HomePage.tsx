import { useEffect, useState } from 'react';
import { AssetService, AccessorieService, LicenseService } from '@/services';
import { StatisticsChart } from '@/components';

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
                          ].filter((item) => item.count > 0)
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
                          ].filter((item) => item.count > 0)
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
                          ].filter((item) => item.count > 0)
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
                <StatisticsChart title="Assets Statistics" data={assetsData} />
                <StatisticsChart title="Accessories Statistics" data={accessoriesData} />
                <StatisticsChart title="Licenses Statistics" data={licensesData} />
            </div>
        </div>
    );
}

export default HomePage;

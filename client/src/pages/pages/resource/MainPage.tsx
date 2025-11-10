import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageController from '@/core/PageController';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';

function MainPage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await controller.service.getAll();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [controller]);

    const columns = [
        { header: 'ID', accessor: 'id' as keyof T },
        { header: 'Name', accessor: 'name' as keyof T },
    ];

    const filteredData = data.filter((item: any) =>
        item.name?.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-100">
                    {controller.resourceName}
                </h1>
                <Button onClick={() => navigate(`/${controller.path}/create`)}>
                    Add New
                </Button>
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
                    <div className="p-8 text-center text-gray-400">
                        Loading...
                    </div>
                ) : (
                    <Table
                        data={filteredData}
                        columns={columns}
                        onRowClick={(row) => navigate(`/${controller.path}/${row.id}`)}
                    />
                )}
            </Card>
        </div>
    );
}

export default MainPage;

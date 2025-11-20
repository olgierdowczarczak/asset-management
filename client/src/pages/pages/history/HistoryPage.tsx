import { HistoryTable } from '@/components';

function HistoryPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-100 mb-6">History</h1>
            <HistoryTable />
        </div>
    );
}

export default HistoryPage;

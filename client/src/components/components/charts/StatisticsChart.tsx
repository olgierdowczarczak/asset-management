import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components';

interface ChartData {
    name: string;
    value: number;
    count: number;
}

interface StatisticsChartProps {
    title: string;
    data: ChartData[];
}

const COLORS = {
    assigned: '#ef4444',
    unassigned: '#10b981',
    noData: '#6b7280',
};

function StatisticsChart({ title, data }: StatisticsChartProps) {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ value }) => `${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((entry, index) => {
                            let color = COLORS.noData;
                            if (entry.name === 'Assigned') color = COLORS.assigned;
                            if (entry.name === 'Unassigned') color = COLORS.unassigned;
                            return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend
                        formatter={(value, entry: any) =>
                            value === 'No data' ? value : `${entry.payload.count} - ${value}`
                        }
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default StatisticsChart;

import { type ReactNode } from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
}

function Table<T extends { id: number }>({ data, columns, onRowClick }: TableProps<T>) {
    const getCellValue = (row: T, column: Column<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return String(row[column.accessor] ?? '');
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-800">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-sm text-gray-400"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row)}
                                className={`transition-colors ${
                                    onRowClick
                                        ? 'cursor-pointer hover:bg-gray-800/50'
                                        : ''
                                }`}
                            >
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={columnIndex}
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-100 ${column.className || ''}`}
                                    >
                                        {getCellValue(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;

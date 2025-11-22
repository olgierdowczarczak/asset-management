import { useState } from 'react';
import type { IColumn } from '@/types';

interface TableProps<T> {
    data: T[];
    columns: IColumn<T>[];
    onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

function Table<T extends { id: number }>({ data, columns, onRowClick }: TableProps<T>) {
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const getCellValue = (row: T, column: IColumn<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return String(row[column.accessor] ?? '');
    };

    const getSortableValue = (row: T, column: IColumn<T>): any => {
        if (typeof column.accessor === 'function') {
            const value = column.accessor(row);
            if (typeof value === 'object' && value !== null && 'props' in value) {
                return '';
            }
            return value;
        }
        return row[column.accessor];
    };

    const handleSort = (columnIndex: number) => {
        if (sortColumn === columnIndex) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection(null);
                setSortColumn(null);
            }
        } else {
            setSortColumn(columnIndex);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (sortColumn === null || sortDirection === null) {
            return 0;
        }

        const column = columns[sortColumn];
        const aValue = getSortableValue(a, column);
        const bValue = getSortableValue(b, column);

        if (aValue == null && bValue == null) {
            return 0;
        }
        if (aValue == null) {
            return 1;
        }
        if (bValue == null) {
            return -1;
        }

        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-800">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                onClick={() => handleSort(index)}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800/50 transition-colors ${column.className || ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    {column.header}
                                    <span className="text-blue-400 w-4 inline-block text-center">
                                        {sortColumn === index && sortDirection === 'asc' && '↑'}
                                        {sortColumn === index && sortDirection === 'desc' && '↓'}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-sm text-gray-400"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row)}
                                className={`transition-colors ${
                                    onRowClick ? 'cursor-pointer hover:bg-gray-800/50' : ''
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

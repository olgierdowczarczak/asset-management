import { useMemo } from 'react';
import type { ResourceSchema } from '@/schemas/types';
import { getDisplayValue } from '@/schemas/utils';
import Table, { type Column } from '../ui/Table';

interface SchemaTableProps<T extends Record<string, any> & { id: number }> {
    schema: ResourceSchema;
    data: T[];
    onRowClick?: (row: T) => void;
    excludeFields?: string[];
}

const SchemaTable = <T extends Record<string, any> & { id: number }>({
    schema,
    data,
    onRowClick,
    excludeFields = [],
}: SchemaTableProps<T>) => {
    const columns = useMemo(() => {
        const cols: Column<T>[] = [];

        Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
            if (fieldSchema.showInTable === false || excludeFields.includes(fieldName)) {
                return;
            }

            const column: Column<T> = {
                header: fieldSchema.label,
                accessor: (row: T) => {
                    const value = row[fieldName];

                    if (value === undefined || value === null) {
                        return '-';
                    }

                    switch (fieldSchema.type) {
                        case 'boolean':
                            return value ? 'Yes' : 'No';

                        case 'reference':
                        case 'polymorphicReference':
                            return getDisplayValue(value, fieldSchema.displayField);

                        case 'enum':
                            return typeof value === 'string'
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : value;

                        default:
                            return value.toString();
                    }
                },
            };

            cols.push(column);
        });

        return cols;
    }, [schema, excludeFields]);

    return <Table data={data} columns={columns} onRowClick={onRowClick} />;
};

export default SchemaTable;

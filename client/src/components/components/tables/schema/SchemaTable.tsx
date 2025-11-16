import { useMemo } from 'react';
import type { IResourceSchema, IColumn } from '@/types';
import { getDisplayValue, getCollectionPath } from '@/lib/schemaHelpers';
import { Table, ReferenceLink } from '@/components';

interface SchemaTableProps<T extends Record<string, any> & { id: number }> {
    schema: IResourceSchema;
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
        const cols: IColumn<T>[] = [];

        Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
            if (fieldSchema.showInTable === false || excludeFields.includes(fieldName)) {
                return;
            }

            const column: IColumn<T> = {
                header: fieldSchema.label,
                accessor: (row: T) => {
                    const value = row[fieldName];
                    if (value === undefined || value === null) {
                        return '-';
                    }

                    switch (fieldSchema.type) {
                        case 'boolean':
                            return value ? 'Yes' : 'No';

                        case 'reference': {
                            const collection = fieldSchema.referencedCollection;
                            if (!collection) {
                                return getDisplayValue(value, fieldSchema.displayField);
                            }
                            return (
                                <ReferenceLink
                                    value={value}
                                    collection={getCollectionPath(collection)}
                                    displayField={fieldSchema.displayField}
                                />
                            );
                        }

                        case 'polymorphicReference': {
                            const modelField = fieldSchema.modelField;
                            if (!modelField) {
                                return getDisplayValue(value, fieldSchema.displayField);
                            }
                            const collection = row[modelField];
                            if (!collection) {
                                return getDisplayValue(value, fieldSchema.displayField);
                            }
                            const actualCollection =
                                collection === 'common' ? row['actualAssigneeModel'] : collection;
                            if (!actualCollection) {
                                return '-';
                            }
                            return (
                                <ReferenceLink
                                    value={value}
                                    collection={getCollectionPath(actualCollection)}
                                    displayField={fieldSchema.displayField}
                                />
                            );
                        }

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

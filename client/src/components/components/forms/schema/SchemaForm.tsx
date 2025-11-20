import { useState, useEffect, useRef, type FormEvent } from 'react';
import type { IResourceSchema, IFieldSchema } from '@/types';
import { extractId, getDisplayValue } from '@/lib/schemaHelpers';
import {
    Input,
    NumberInput,
    Select,
    Checkbox,
    Label,
    Button,
    SearchableSelect,
} from '@/components';
import { client } from '@/api';

interface SchemaFormProps {
    schema: IResourceSchema;
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => Promise<void>;
    submitButtonText?: string;
    isLoading?: boolean;
}

const SchemaForm = ({
    schema,
    initialData = {},
    onSubmit,
    submitButtonText = 'Submit',
    isLoading = false,
}: SchemaFormProps) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [referenceOptions, setReferenceOptions] = useState<Record<string, any[]>>({});
    const [loadingReferences, setLoadingReferences] = useState<Set<string>>(new Set());
    const initialDataRef = useRef(initialData);
    const isEditMode = Boolean(initialData?.id);
    const isCreateMode = !isEditMode;
    const shouldShowField = (fieldSchema: IFieldSchema): boolean => {
        if (fieldSchema.showInForm === false) {
            return false;
        }
        if (fieldSchema.showInCreate !== undefined && isCreateMode) {
            return fieldSchema.showInCreate;
        }
        if (fieldSchema.showInEdit !== undefined && isEditMode) {
            return fieldSchema.showInEdit;
        }
        return true;
    };

    const isFieldReadonly = (fieldSchema: IFieldSchema): boolean => {
        if (fieldSchema.readonly) {
            return true;
        }
        if (fieldSchema.readonlyOnEdit && isEditMode) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        initialDataRef.current = initialData;
    }, [initialData]);

    useEffect(() => {
        const initialFormData: Record<string, any> = {};
        Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
            if (!shouldShowField(fieldSchema)) {
                return;
            }

            const initialValue = initialDataRef.current[fieldName];
            if (initialValue !== undefined) {
                initialFormData[fieldName] = extractId(initialValue) ?? initialValue;
            } else if (fieldSchema.default !== undefined) {
                initialFormData[fieldName] = fieldSchema.default;
            }
        });
        setFormData(initialFormData);
        setErrors({});
        setReferenceOptions({});
        setLoadingReferences(new Set());
    }, [schema, isEditMode]);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();
        const loadReferenceOptions = async () => {
            const collectionsToLoad = new Set<string>();
            const fieldsByCollection = new Map<string, string[]>();
            Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
                if (
                    shouldShowField(fieldSchema) &&
                    (fieldSchema.type === 'reference' ||
                        fieldSchema.type === 'polymorphicReference') &&
                    fieldSchema.referencedCollection
                ) {
                    const collection = fieldSchema.referencedCollection;
                    collectionsToLoad.add(collection);
                    if (!fieldsByCollection.has(collection)) {
                        fieldsByCollection.set(collection, []);
                    }
                    fieldsByCollection.get(collection)!.push(fieldName);
                }
            });

            for (const collection of collectionsToLoad) {
                if (!isMounted) {
                    break;
                }

                const fieldsForCollection = fieldsByCollection.get(collection) || [];
                if (isMounted && fieldsForCollection.length > 0) {
                    setLoadingReferences((prev) => {
                        const newSet = new Set(prev);
                        fieldsForCollection.forEach((field) => newSet.add(field));
                        return newSet;
                    });
                }

                try {
                    const response = await client.get(`/${collection}/`, {
                        signal: abortController.signal,
                        params: { limit: 1000 },
                    });

                    if (isMounted) {
                        const data = response.data?.items || response.data || [];
                        setReferenceOptions((prev) => ({
                            ...prev,
                            [collection]: Array.isArray(data) ? data : [],
                        }));
                    }
                } catch (error: any) {
                    if (error.name === 'CanceledError' || error.name === 'AbortError') {
                        break;
                    }
                    if (isMounted) {
                        setReferenceOptions((prev) => ({
                            ...prev,
                            [collection]: [],
                        }));
                    }
                } finally {
                    if (isMounted && fieldsForCollection.length > 0) {
                        setLoadingReferences((prev) => {
                            const newSet = new Set(prev);
                            fieldsForCollection.forEach((field) => newSet.delete(field));
                            return newSet;
                        });
                    }
                }
            }
        };

        loadReferenceOptions();
        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [schema, isEditMode]);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();
        const loadPolymorphicOptions = async () => {
            const polymorphicFields = Object.entries(schema).filter(
                ([, fieldSchema]) =>
                    fieldSchema.type === 'polymorphicReference' && fieldSchema.modelField,
            );
            for (const [fieldName, fieldSchema] of polymorphicFields) {
                const modelFieldName = fieldSchema.modelField!;
                const modelValue = formData[modelFieldName];

                if (!modelValue) {
                    continue;
                }

                if (modelValue === 'common') {
                    const collectionsToLoad = ['users', 'locations'];
                    for (const collection of collectionsToLoad) {
                        if (!referenceOptions[collection]) {
                            setLoadingReferences((prev) => new Set(prev).add(fieldName));

                            try {
                                const response = await client.get(`/${collection}/`, {
                                    signal: abortController.signal,
                                    params: { limit: 1000 },
                                });

                                if (isMounted) {
                                    const data = response.data?.items || response.data || [];
                                    setReferenceOptions((prev) => ({
                                        ...prev,
                                        [collection]: Array.isArray(data) ? data : [],
                                    }));
                                }
                            } catch (error: any) {
                                if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                                    if (isMounted) {
                                        setReferenceOptions((prev) => ({
                                            ...prev,
                                            [collection]: [],
                                        }));
                                    }
                                }
                            } finally {
                                if (isMounted) {
                                    setLoadingReferences((prev) => {
                                        const newSet = new Set(prev);
                                        newSet.delete(fieldName);
                                        return newSet;
                                    });
                                }
                            }
                        }
                    }
                } else if (!referenceOptions[modelValue]) {
                    setLoadingReferences((prev) => new Set(prev).add(fieldName));

                    try {
                        const response = await client.get(`/${modelValue}/`, {
                            signal: abortController.signal,
                            params: { limit: 1000 },
                        });

                        if (isMounted) {
                            const data = response.data?.items || response.data || [];
                            setReferenceOptions((prev) => ({
                                ...prev,
                                [modelValue]: Array.isArray(data) ? data : [],
                            }));
                        }
                    } catch (error: any) {
                        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                            if (isMounted) {
                                setReferenceOptions((prev) => ({
                                    ...prev,
                                    [modelValue]: [],
                                }));
                            }
                        }
                    } finally {
                        if (isMounted) {
                            setLoadingReferences((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(fieldName);
                                return newSet;
                            });
                        }
                    }
                }
            }
        };

        loadPolymorphicOptions();
        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [schema, formData, referenceOptions]);

    const handleChange = (fieldName: string, value: any) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                [fieldName]: value,
            };

            const polymorphicFields = Object.entries(schema).filter(
                ([, fieldSchema]) =>
                    fieldSchema.type === 'polymorphicReference' &&
                    fieldSchema.modelField === fieldName,
            );

            polymorphicFields.forEach(([polyFieldName]) => {
                if (prev[fieldName] !== value) {
                    newData[polyFieldName] = undefined;
                }
            });

            return newData;
        });

        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
            if (!shouldShowField(fieldSchema) || isFieldReadonly(fieldSchema)) {
                return;
            }

            const value = formData[fieldName];
            let isRequired = fieldSchema.required;
            if (fieldSchema.requiredIf) {
                const { field, value: requiredValue } = fieldSchema.requiredIf;
                const dependentFieldValue = formData[field];
                if (dependentFieldValue === requiredValue) {
                    if (!(isEditMode && fieldSchema.type === 'password')) {
                        isRequired = true;
                    }
                }
            }

            if (isRequired && (value === undefined || value === '' || value === null)) {
                newErrors[fieldName] = `${fieldSchema.label} is required`;
                return;
            }

            if (!value && !isRequired) {
                return;
            }

            if (
                (fieldSchema.type === 'string' || fieldSchema.type === 'password') &&
                typeof value === 'string'
            ) {
                if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
                    newErrors[fieldName] =
                        `${fieldSchema.label} must be at least ${fieldSchema.minLength} characters`;
                }
                if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
                    newErrors[fieldName] =
                        `${fieldSchema.label} must be at most ${fieldSchema.maxLength} characters`;
                }
            }

            if (fieldSchema.type === 'number' && value !== '') {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    newErrors[fieldName] = `${fieldSchema.label} must be a number`;
                } else {
                    if (fieldSchema.min !== undefined && numValue < fieldSchema.min) {
                        newErrors[fieldName] =
                            `${fieldSchema.label} must be at least ${fieldSchema.min}`;
                    }
                    if (fieldSchema.max !== undefined && numValue > fieldSchema.max) {
                        newErrors[fieldName] =
                            `${fieldSchema.label} must be at most ${fieldSchema.max}`;
                    }
                }
            }

            if (fieldSchema.type === 'email' && value) {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(value)) {
                    newErrors[fieldName] = 'Please enter a valid email address';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const dataToSubmit: Record<string, any> = {};
        Object.entries(formData).forEach(([key, value]) => {
            const fieldSchema = schema[key];
            if (fieldSchema && !isFieldReadonly(fieldSchema) && shouldShowField(fieldSchema)) {
                if (value === '' && !fieldSchema.required) {
                    dataToSubmit[key] = null;
                } else if (value === undefined && !fieldSchema.required) {
                    dataToSubmit[key] = null;
                } else if (fieldSchema.type === 'number' && value !== '') {
                    dataToSubmit[key] = Number(value);
                } else {
                    dataToSubmit[key] = value;
                }
            }
        });

        await onSubmit(dataToSubmit);
    };

    const renderField = (fieldName: string, fieldSchema: IFieldSchema) => {
        if (!shouldShowField(fieldSchema) || fieldSchema.readonly) {
            return null;
        }

        const value = formData[fieldName] ?? '';
        const error = errors[fieldName];
        const fieldReadonly = isFieldReadonly(fieldSchema);
        const commonProps = {
            id: fieldName,
            name: fieldName,
            error,
            disabled: isLoading || fieldReadonly,
        };

        switch (fieldSchema.type) {
            case 'string':
            case 'email':
            case 'password':
                return (
                    <Input
                        {...commonProps}
                        type={
                            fieldSchema.type === 'email'
                                ? 'email'
                                : fieldSchema.type === 'password'
                                  ? 'password'
                                  : 'text'
                        }
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        placeholder={fieldSchema.placeholder}
                        minLength={fieldSchema.minLength}
                        maxLength={fieldSchema.maxLength}
                        required={fieldSchema.required}
                    />
                );

            case 'number':
                return (
                    <NumberInput
                        {...commonProps}
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        placeholder={fieldSchema.placeholder}
                        min={fieldSchema.min}
                        max={fieldSchema.max}
                        required={fieldSchema.required}
                    />
                );

            case 'boolean':
                return (
                    <Checkbox
                        {...commonProps}
                        checked={Boolean(value)}
                        onChange={(e) => handleChange(fieldName, e.target.checked)}
                        label={fieldSchema.label}
                    />
                );

            case 'enum':
                const enumOptions =
                    fieldSchema.enumValues?.map((val) => ({
                        value: val,
                        label: val
                            .split('_')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' '),
                    })) || [];

                return (
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                {...commonProps}
                                value={value ?? ''}
                                onChange={(e) =>
                                    handleChange(fieldName, e.target.value || undefined)
                                }
                                options={enumOptions}
                                placeholder={`Select ${fieldSchema.label}`}
                                required={fieldSchema.required}
                            />
                        </div>
                        {!fieldSchema.required && value && (
                            <button
                                type="button"
                                onClick={() => handleChange(fieldName, undefined)}
                                className="px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded border border-gray-700 transition-colors"
                                title="Clear selection"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                );

            case 'reference':
                const collection = fieldSchema.referencedCollection!;
                const options = referenceOptions[collection] || [];
                const isLoadingRef = loadingReferences.has(fieldName);
                const filteredRefOptions =
                    fieldSchema.excludeSelfFromOptions && initialData.id
                        ? options.filter((item) => item.id !== initialData.id)
                        : options;
                const refOptions = filteredRefOptions.map((item) => ({
                    value: item.id,
                    label: getDisplayValue(item, fieldSchema.displayField),
                }));

                return (
                    <SearchableSelect
                        {...commonProps}
                        value={value ?? ''}
                        onChange={(newValue) =>
                            handleChange(fieldName, newValue ? Number(newValue) : undefined)
                        }
                        options={refOptions}
                        placeholder={
                            isLoadingRef ? 'Loading...' : `Select or search ${fieldSchema.label}`
                        }
                        disabled={isLoadingRef || isLoading}
                        required={fieldSchema.required}
                        allowClear={!fieldSchema.required}
                        onClear={() => handleChange(fieldName, undefined)}
                    />
                );

            case 'polymorphicReference':
                const modelFieldName = fieldSchema.modelField;
                const modelValue = modelFieldName ? formData[modelFieldName] : null;

                if (!modelValue) {
                    return (
                        <SearchableSelect
                            {...commonProps}
                            value=""
                            onChange={() => {}}
                            options={[]}
                            placeholder={`Select ${modelFieldName?.replace('Model', ' Type')} first`}
                            disabled={true}
                            required={fieldSchema.required}
                        />
                    );
                }

                const isLoadingPoly = loadingReferences.has(fieldName);

                if (modelValue === 'common') {
                    const users = referenceOptions['users'] || [];
                    const locations = referenceOptions['locations'] || [];
                    const combinedOptions = [
                        ...users.map((item) => ({
                            value: `users:${item.id}`,
                            label: `User: ${getDisplayValue(item, 'fullName')}`,
                        })),
                        ...locations.map((item) => ({
                            value: `locations:${item.id}`,
                            label: `Location: ${getDisplayValue(item, 'name')}`,
                        })),
                    ];

                    const actualType = formData['actualAssigneeModel'];
                    const currentValue = value && actualType ? `${actualType}:${value}` : '';

                    return (
                        <SearchableSelect
                            {...commonProps}
                            value={currentValue}
                            onChange={(newValue) => {
                                if (!newValue) {
                                    handleChange(fieldName, undefined);
                                    handleChange('actualAssigneeModel', undefined);
                                } else {
                                    const [type, id] = newValue.split(':');
                                    handleChange(fieldName, Number(id));
                                    handleChange('actualAssigneeModel', type);
                                }
                            }}
                            options={combinedOptions}
                            placeholder={
                                isLoadingPoly
                                    ? 'Loading...'
                                    : `Select or search ${fieldSchema.label}`
                            }
                            disabled={isLoadingPoly || isLoading}
                            required={fieldSchema.required}
                            allowClear={!fieldSchema.required}
                            onClear={() => {
                                handleChange(fieldName, undefined);
                                handleChange('actualAssigneeModel', undefined);
                            }}
                        />
                    );
                }

                const polyOptions = referenceOptions[modelValue] || [];
                const polyDisplayField =
                    modelValue === 'users' ? 'fullName' : fieldSchema.displayField || 'name';
                const polyOptions2 = polyOptions.map((item) => ({
                    value: item.id,
                    label: getDisplayValue(item, polyDisplayField),
                }));

                return (
                    <SearchableSelect
                        {...commonProps}
                        value={value ?? ''}
                        onChange={(newValue) => {
                            handleChange(fieldName, newValue ? Number(newValue) : undefined);
                            handleChange('actualAssigneeModel', modelValue);
                        }}
                        options={polyOptions2}
                        placeholder={
                            isLoadingPoly ? 'Loading...' : `Select or search ${fieldSchema.label}`
                        }
                        disabled={isLoadingPoly || isLoading}
                        required={fieldSchema.required}
                        allowClear={!fieldSchema.required}
                        onClear={() => {
                            handleChange(fieldName, undefined);
                            handleChange('actualAssigneeModel', undefined);
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(schema).map(([fieldName, fieldSchema]) => {
                if (!shouldShowField(fieldSchema) || fieldSchema.readonly) {
                    return null;
                }

                const showLabel = fieldSchema.type !== 'boolean';
                let isFieldRequired = fieldSchema.required;
                if (fieldSchema.requiredIf) {
                    const { field, value: requiredValue } = fieldSchema.requiredIf;
                    const dependentFieldValue = formData[field];
                    if (dependentFieldValue === requiredValue) {
                        isFieldRequired = true;
                    }
                }

                return (
                    <div key={fieldName}>
                        {showLabel && (
                            <Label htmlFor={fieldName} required={isFieldRequired}>
                                {fieldSchema.label}
                            </Label>
                        )}
                        {renderField(fieldName, fieldSchema)}
                    </div>
                );
            })}

            <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : submitButtonText}
                </Button>
            </div>
        </form>
    );
};

export default SchemaForm;

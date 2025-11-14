export type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'password'
    | 'enum'
    | 'reference'
    | 'polymorphicReference';

export interface FieldSchema {
    type: FieldType;
    label: string;
    required?: boolean;
    requiredIf?: { field: string; value: any };
    readonly?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    default?: any;
    enumValues?: readonly string[];
    referencedCollection?: string;
    displayField?: string;
    modelField?: string;
    showInTable?: boolean;
    showInForm?: boolean;
    showInDetail?: boolean;
    placeholder?: string;
}

export interface ResourceSchema {
    [fieldName: string]: FieldSchema;
}

export interface PopulatedReference {
    id: number;
    name?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

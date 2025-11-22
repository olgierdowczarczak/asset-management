type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'password'
    | 'enum'
    | 'reference'
    | 'polymorphicReference';

export default interface FieldSchema {
    type: FieldType;
    label: string;
    required?: boolean;
    requiredIf?: { field: string; value: any };
    readonly?: boolean;
    readonlyOnEdit?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    default?: any;
    enumValues?: readonly string[];
    referencedCollection?: string;
    displayField?: string;
    modelField?: string;
    excludeSelfFromOptions?: boolean;
    showInTable?: boolean;
    showInForm?: boolean;
    showInCreate?: boolean;
    showInEdit?: boolean;
    showInDetail?: boolean;
    placeholder?: string;
}

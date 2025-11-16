import type FieldSchema from './fieldSchema';

export default interface ResourceSchema {
    [fieldName: string]: FieldSchema;
}

import type GetResources from './responses/getResources';

export default interface Resource<T> {
    get: () => Promise<GetResources<T> | null>;
}

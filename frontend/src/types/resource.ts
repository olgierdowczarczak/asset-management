import type ResourceResponse from './resourceResponse';

export default interface Resource<T> {
    get: () => Promise<ResourceResponse<T> | null>;
}

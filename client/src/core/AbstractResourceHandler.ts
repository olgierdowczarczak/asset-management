import type { IResource } from '@/types';

abstract class AbstractResourceHandler<T> implements IResource<T> {
    readonly resourceName: string;
    readonly path: string;
    readonly registeredRoutes: string[] = [];
    
    constructor(resourceName: string) {
        this.resourceName = resourceName;
        this.path = resourceName.toLowerCase();
        this.registerRoute('/');
        this.registerRoute('/create');
        this.registerRoute('/:id');
        this.registerRoute('/:id/edit');
        this.registerRoute('/:id/delete');
    }

    abstract getAll: () => Promise<T[] | null>;
    abstract create: (data: T) => Promise<T>;
    abstract get: (id: number) => Promise<T | null>;
    abstract edit: (id: number, data: T) => Promise<T | null>;
    abstract delete: (id: number) => Promise<void>;

    protected registerRoute(route: string) {
        this.registeredRoutes.push(`${this.path}/${route}`);
    }
};

export default AbstractResourceHandler;

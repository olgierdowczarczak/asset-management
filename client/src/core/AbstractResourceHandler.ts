import type { ComponentType } from 'react';
import type { IResource } from '@/types';
import * as Pages from '@/pages';
import { validateError } from '@/lib/helpers';

interface RegisteredRoute {
    path: string;
    element: ComponentType;
}

abstract class AbstractResourceHandler<T> implements IResource<T> {
    readonly resourceName: string;
    readonly path: string;
    readonly registeredRoutes: RegisteredRoute[] = [];

    constructor(resourceName: string) {
        this.resourceName = resourceName;
        this.path = resourceName.toLowerCase();

        this.registerRoute('/', Pages.HomePage);
        this.registerRoute('/create', Pages.HomePage);
        this.registerRoute('/:id', Pages.HomePage);
        this.registerRoute('/:id/edit', Pages.HomePage);
        this.registerRoute('/:id/delete', Pages.HomePage);

        this.wrapMethods();
    }

    protected registerRoute(route: string, element: ComponentType) {
        const path = `/${this.path}${route}`.replace(/\/+/g, '/');
        this.registeredRoutes.push({ path, element });
    }

    private wrapMethods() { 
        const proto = Object.getPrototypeOf(this);
        const propertyNames = Object.getOwnPropertyNames(proto);
        
        for (const name of propertyNames) {
            const prop = (this as any)[name];
            if (typeof prop === 'function' && name !== 'constructor' && name !== 'useFunction') {
                (this as any)[name] = this.wrapLogging(prop.bind(this));
            }
        }
    }; 
    
    protected wrapLogging<F extends (...args: any[]) => Promise<any>>(fn: F): (...args: Parameters<F>) => Promise<ReturnType<F> | null> { 
        return async (...args: Parameters<F>) => {
            try {
                return await fn(...args); 
            } catch (error: any) {
                validateError(error, 'Unexpected error'); 
                return null;
            }
        };
    }

    abstract getAll(): Promise<T[] | null>;
    abstract create(data: T): Promise<T | null>;
    abstract get(id: number): Promise<T | null>;
    abstract edit(id: number, data: T): Promise<T | null>;
    abstract delete(id: number): Promise<void>;
}

export default AbstractResourceHandler;

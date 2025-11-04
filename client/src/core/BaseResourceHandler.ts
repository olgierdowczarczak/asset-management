import type { ComponentType } from 'react';
import validateError from '@/lib/helpers/validateError';

interface RegisteredRoute {
    path: string;
    element: ComponentType;
}

class ResourceHandler<S> {
    readonly resourceName: string;
    readonly service: S;
    readonly path: string;
    readonly registeredRoutes: RegisteredRoute[] = [];

    constructor(resourceName: string, service: S) {
        this.resourceName = resourceName;
        this.path = resourceName.toLowerCase();
        this.service = service;
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
    }

    protected wrapLogging<F extends (...args: any[]) => Promise<any>>(
        fn: F,
    ): (...args: Parameters<F>) => Promise<ReturnType<F> | null> {
        return async (...args: Parameters<F>) => {
            try {
                return await fn(...args);
            } catch (error: any) {
                validateError(error, 'Unexpected error');
                return null;
            }
        };
    }
}

export default ResourceHandler;

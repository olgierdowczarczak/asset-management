import type { IResource } from '@/types';
import * as Pages from '@/pages';
import BaseResourceHandler from './BaseResourceHandler';

class ResourceController<T, S extends IResource<T>>
    extends BaseResourceHandler<S>
    implements IResource<T>
{
    constructor(resourceName: string, service: S) {
        super(resourceName, service);
        this.registerRoute('/', Pages.ResourceMainPage);
        this.registerRoute('/create', Pages.ResourceCreatePage);
        this.registerRoute('/:id', Pages.ResourceResourcePage);
        this.registerRoute('/:id/edit', Pages.ResourceEditPage);
        this.registerRoute('/:id/delete', Pages.ResourceMainPage);
    }

    getAll = async (): Promise<T[] | null> => this.service.getAll();
    create = async (data: T): Promise<T | null> => this.service.create(data);
    get = async (id: number): Promise<T | null> => this.service.get(id);
    edit = async (id: number, data: T): Promise<T | null> => this.service.edit(id, data);
    delete = async (id: number): Promise<void> => this.service.delete(id);
}

export default ResourceController;

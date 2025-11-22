import * as Pages from '@/pages';
import PageHandler from '../PageHandler';
import type { IResourceSchema } from '@/types';

class Resource<S> extends PageHandler<S> {
    constructor(resourceName: string, service: S, schema?: IResourceSchema) {
        super(resourceName, service, schema);
        this.registerRoute('/', Pages.ResourceMainPage);
        this.registerRoute('/create', Pages.ResourceCreatePage);
        this.registerRoute('/:id', Pages.ResourceResourcePage);
        this.registerRoute('/:id/edit', Pages.ResourceEditPage);
        this.registerRoute('/:id/delete', Pages.ResourceMainPage);
    }
}

export default Resource;

import * as Pages from '@/pages';
import PageHandler from '../PageHandler';
import type { IResourceSchema } from '@/types';

class MainResource<S> extends PageHandler<S> {
    constructor(resourceName: string, service: S, schema?: IResourceSchema) {
        super(resourceName, service, schema);
        this.registerRoute('/', Pages.ResourceMainPage);
        this.registerRoute('/create', Pages.ResourceCreatePage);
        this.registerRoute('/:id/edit', Pages.ResourceEditPage);
        this.registerRoute('/:id/history', Pages.ResourceHistoryPage);
        this.registerRoute('/:id/delete', Pages.ResourceMainPage);
        this.registerRoute('/:id', Pages.ResourceResourcePage);
    }
}

export default MainResource;

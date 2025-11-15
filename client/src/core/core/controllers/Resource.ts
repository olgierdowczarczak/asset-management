import * as Pages from '@/pages';
import PageHandler from '../PageHandler';

class Resource<S> extends PageHandler<S> {
    constructor(resourceName: string, service: S) {
        super(resourceName, service);
        this.registerRoute('/', Pages.ResourceMainPage);
        this.registerRoute('/create', Pages.ResourceCreatePage);
        this.registerRoute('/:id', Pages.ResourceResourcePage);
        this.registerRoute('/:id/edit', Pages.ResourceEditPage);
        this.registerRoute('/:id/delete', Pages.ResourceMainPage);
    }
}

export default Resource;

import * as Pages from '@/pages';
import PageHandler from '../PageHandler';
import type { IResourceSchema } from '@/types';

class InstanceMasterResource<S> extends PageHandler<S> {
    readonly instanceService: any;
    readonly instanceSchema: IResourceSchema;

    constructor(
        resourceName: string,
        service: S,
        schema: IResourceSchema,
        instanceService: any,
        instanceSchema: IResourceSchema,
    ) {
        super(resourceName, service, schema);
        this.instanceService = instanceService;
        this.instanceSchema = instanceSchema;

        this.registerRoute('/', Pages.ResourceMainPage);
        this.registerRoute('/create', Pages.ResourceCreatePage);
        this.registerRoute('/:id/edit', Pages.ResourceEditPage);
        this.registerRoute('/:id/history', Pages.ResourceHistoryPage);
        this.registerRoute('/:id/delete', Pages.ResourceMainPage);
        this.registerRoute('/:id', Pages.InstanceMasterPage);
    }
}

export default InstanceMasterResource;

import type { IMainResource, IHistoryRecord } from '@/types';
import * as Pages from '@/pages';
import ResourceController from './ResourceController';

class MainResourceController<T>
    extends ResourceController<T, IMainResource<T>>
    implements IMainResource<T>
{
    constructor(resourceName: string, service: IMainResource<T>) {
        super(resourceName, service);
        this.registerRoute('/:id/history', Pages.ResourceHistoryPage);
    }

    history = async (id: number): Promise<IHistoryRecord[] | null> => this.service.history(id);
    historyRecord = async (id: number, recordId: number): Promise<IHistoryRecord | null> =>
        this.service.historyRecord(id, recordId);
}

export default MainResourceController;

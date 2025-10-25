import type { IMainResource, IHistoryRecord } from '@/types';
import * as Pages from '@/pages';
import AbstractResourceHandler from './AbstractResourceHandler';

abstract class AbstractMainResourceHandler<T> extends AbstractResourceHandler<T> implements IMainResource<T> {
    constructor(resourceName: string) {
        super(resourceName);
        this.registerRoute('/:id/history', Pages.HomePage);
    }

    abstract history: (id: number) => Promise<IHistoryRecord[] | null>;
};

export default AbstractMainResourceHandler;

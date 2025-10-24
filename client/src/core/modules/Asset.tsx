import type { IAsset } from '@/types';
import { AssetService } from '@/services';
import AbstractMainResourceHandler from '../AbstractMainResourceHandler';

class Asset extends AbstractMainResourceHandler<IAsset> {
    getAll = async() => AssetService.getAll();
    create = async(data: IAsset) => AssetService.create(data);
    get = async(id: number) => AssetService.get(id);
    edit = async(id: number, data: IAsset) => AssetService.edit(id, data);
    delete = async() => AssetService.delete();
    history = async(id: number) => AssetService.history(id);
};

export default Asset;

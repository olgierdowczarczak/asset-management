import type { IAccessorie } from '@/types';
import { AccessorieService } from '@/services';
import AbstractMainResourceHandler from '../AbstractMainResourceHandler';

class Accessorie extends AbstractMainResourceHandler<IAccessorie> {
    getAll = async() => AccessorieService.getAll();
    create = async(data: IAccessorie) => AccessorieService.create(data);
    get = async(id: number) => AccessorieService.get(id);
    edit = async(id: number, data: IAccessorie) => AccessorieService.edit(id, data);
    delete = async(id: number) => AccessorieService.delete(id);
    history = async(id: number) => AccessorieService.history(id);
};

export default Accessorie;

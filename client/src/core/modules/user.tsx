import type { IUser } from '@/types';
import { UserService } from '@/services';
import AbstractMainResourceHandler from '../AbstractMainResourceHandler';

class User extends AbstractMainResourceHandler<IUser> {
    getAll = async() => UserService.getAll();
    create = async(data: IUser) => UserService.create(data);
    get = async(id: number) => UserService.get(id);
    edit = async(id: number, data: IUser) => UserService.edit(id, data);
    delete = async(id: number) => UserService.delete(id);
    history = async(id: number) => UserService.history(id);
};

export default User;

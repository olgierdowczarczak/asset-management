import type { ILicense } from '@/types';
import { LicenseService } from '@/services';
import AbstractMainResourceHandler from '../AbstractMainResourceHandler';

class License extends AbstractMainResourceHandler<ILicense> {
    getAll = async() => LicenseService.getAll();
    create = async(data: ILicense) => LicenseService.create(data);
    get = async(id: number) => LicenseService.get(id);
    edit = async(id: number, data: ILicense) => LicenseService.edit(id, data);
    delete = async(id: number) => LicenseService.delete(id);
    history = async(id: number) => LicenseService.history(id);
};

export default License;

import type Resource from '../../types/resource';
import type Accessorie from '../../types/accessorie';
import * as AccessoriesApi from '../../api/accessories';

export default function useAccessories(): Resource<Accessorie> {
    return {
        async get() {
            try {
                return await AccessoriesApi.fetchAccessories();
            } catch {
                return null;
            }
        },
    };
}

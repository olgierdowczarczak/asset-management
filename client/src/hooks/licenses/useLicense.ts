import type Resource from '../../types/resource';
import type License from '../../types/license';
import * as LicensesApi from '../../api/licenses';

export default function useLicense(): Resource<License> {
    return {
        async get() {
            try {
                return await LicensesApi.fetchAccessories();
            } catch {
                return null;
            }
        },
    };
}

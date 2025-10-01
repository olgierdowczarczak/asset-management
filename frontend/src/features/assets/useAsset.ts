import type Resource from '../../types/resource';
import type Asset from '../../types/asset';
import * as AssetsApi from '../../api/assets';

export default function useAsset(): Resource<Asset> {
    return {
        async get() {
            try {
                return await AssetsApi.fetchAccessories();
            } catch {
                return null;
            }
        },
    };
}

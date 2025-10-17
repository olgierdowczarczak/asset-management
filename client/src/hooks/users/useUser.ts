import type Resource from '../../types/resource';
import type User from '../../types/user';
import * as UsersApi from '../../api/users';

export default function useUser(): Resource<User> {
    return {
        async get() {
            try {
                return await UsersApi.fetchAccessories();
            } catch {
                return null;
            }
        },
    };
}

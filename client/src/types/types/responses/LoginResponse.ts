import type { User } from '@/schemas/usersSchema';

export default interface ILoginResponse {
    user: User;
    access_token: string;
}

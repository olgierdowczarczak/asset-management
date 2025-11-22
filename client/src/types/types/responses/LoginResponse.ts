import type { User } from '@/schemas';

export default interface ILoginResponse {
    user: User;
    access_token: string;
}

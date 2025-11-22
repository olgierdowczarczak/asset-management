import type { User } from '@/schemas';
import type ILoginForm from '../forms/LoginForm';

export default interface AuthContextType {
    user: User | null;
    login: (credentials: ILoginForm) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

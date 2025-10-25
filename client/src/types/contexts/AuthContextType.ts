import type User from '../user';
import type LoginFormData from '../forms/LoginFormData';

export default interface AuthContextType {
    user: User | null;
    login: (credentials: LoginFormData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

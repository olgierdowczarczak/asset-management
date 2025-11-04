import type IUser from '../resources/user';
import type ILoginForm from '../forms/LoginForm';

export default interface AuthContextType {
    user: IUser | null;
    login: (credentials: ILoginForm) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

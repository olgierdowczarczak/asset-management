import { createContext, useState, useEffect, useContext } from 'react';
import type { IAuthContextType, IUser, ILoginFormData } from '@/types';
import { AuthService } from '@/services';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (credentials: ILoginFormData) => {
        const user: IUser | null = await AuthService.loginRequest(credentials);
        setUser(user);
    };

    const logout = async () => {
        await AuthService.logoutRequest();
        setUser(null);
    };

    useEffect(() => {
        AuthService.getMe()
            .then((user) => setUser(user))
            .catch(() => {
                if (user) {
                    logout();
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext should be use in AuthProvider');
    }
    return context;
};

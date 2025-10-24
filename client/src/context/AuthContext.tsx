import { createContext, useState, useEffect, useContext } from 'react';
import type { AuthContextType, User, LoginFormData } from '@/types';
import { AuthService } from '@/services';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (credentials: LoginFormData) => {
        const user = await AuthService.loginRequest(credentials);
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
            .finally(() => setLoading(false))
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

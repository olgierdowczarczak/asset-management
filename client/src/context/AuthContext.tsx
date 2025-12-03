import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { IAuthContextType, IUser, ILoginForm } from '@/types';
import { AuthService } from '@/services';
import { StorageConstants } from '@/constants';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (credentials: ILoginForm) => {
        const response = await AuthService.loginRequest(credentials);
        setUser(response.user);
        localStorage.setItem(StorageConstants.accessToken, response.access_token);
    };

    const logout = async () => {
        await AuthService.logoutRequest();
        setUser(null);
        localStorage.removeItem(StorageConstants.accessToken);
    };

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem(StorageConstants.accessToken);
        if (!token) {
            setLoading(false);
            return;
        }

        AuthService.getMe()
            .then((dbUser) => {
                if (isMounted) {
                    setUser(dbUser);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setUser(null);
                    localStorage.removeItem(StorageConstants.accessToken);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
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
        throw new Error('useAuthContext should be used within AuthProvider');
    }
    return context;
};

import { createContext, useState, useEffect, useContext } from 'react';
import type { IAuthContextType, IUser, ILoginForm } from '@/types';
import { AuthService } from '@/services';
import * as React from 'react';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (credentials: ILoginForm) => {
        const response = await AuthService.loginRequest(credentials);
        setUser(response.user);
        localStorage.setItem('access_token', response.access_token);
    };

    const logout = async () => {
        await AuthService.logoutRequest();
        setUser(null);
        localStorage.removeItem('access_token');
    };

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem('access_token');
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
                    localStorage.removeItem('access_token');
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
        throw new Error('useAuthContext should be use in AuthProvider');
    }
    return context;
};

import { createContext, useContext, useState, useEffect } from 'react';
import type User from '../types/user';
import type LoginRequest from '../types/auth';
import * as AuthApi from '../api/auth';

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    isChecked: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            AuthApi
                .getMe()
                .then((user) => setUser(user))
                .catch(() => setUser(null))
                .finally(() => setIsChecked(true));
        };

        if (user) {
            setIsChecked(true);
            return;
        }

        fetchUser();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const user: User | null = await AuthApi.loginUser(credentials);
            setUser(user);
        } catch (err) {
            console.error(err);
        }
    };
    const logout = async () => {
        try {
            await AuthApi.logoutUser();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isChecked, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

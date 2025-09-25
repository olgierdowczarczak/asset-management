import { createContext, useContext, useState } from 'react';
import type User from '../types/user';
import type LoginRequest from '../types/auth';
import * as AuthApi from '../api/auth';

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const login = async (credentials: LoginRequest) => {
        try {
            const user: User | null = await AuthApi.loginUser(credentials);
            setUser(user);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }
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
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
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

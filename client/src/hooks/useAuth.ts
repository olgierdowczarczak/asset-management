import { useAuthContext } from '@/context/AuthContext';

const useAuth = () => {
    const { user, login, logout, isAuthenticated, loading } = useAuthContext();
    return { user, login, logout, isAuthenticated, loading };
};

export default useAuth;

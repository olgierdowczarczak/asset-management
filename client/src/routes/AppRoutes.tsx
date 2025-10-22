import { Routes, Route } from 'react-router-dom';
import { Routes as ConfigRoutes } from '@/config';
import * as Pages from '../pages';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route>
                // add auth layout
                <Route path={ConfigRoutes.LOGIN} element={<Pages.LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                // add app layout
                <Route path={ConfigRoutes.HOME} element={<Pages.HomePage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;

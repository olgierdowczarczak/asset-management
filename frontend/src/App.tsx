import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './config/routes';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PrivateRoute from './components/PrivateRoute';

import { LoginPage } from './pages/Login';
import { LogoutPage } from './pages/Logout';
import { HomePage } from './pages/Home';

export default function () {
    return (
        <Router>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path={ROUTES.auth.login} element={<LoginPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path={ROUTES.auth.logout} element={<LogoutPage />} />
                    <Route element={<MainLayout />}>
                        <Route path={ROUTES.home} element={<HomePage />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

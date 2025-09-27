import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './config/routes';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import { LoginPage } from './pages/Login';
import { LogoutPage } from './pages/Logout';
import { HomePage } from './pages/Home';

export default function () {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path={ROUTES.home} element={<HomePage />} />
                </Route>
                
                <Route element={<AuthLayout />}>
                    <Route path={ROUTES.auth.login} element={<LoginPage />} />
                    <Route path={ROUTES.auth.logout} element={<LogoutPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

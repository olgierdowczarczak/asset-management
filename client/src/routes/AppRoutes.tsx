import { Routes, Route } from 'react-router-dom';
import config from '@/config';
import * as Layouts from '@/components/layouts';
import * as Controllers from '@/core';
import * as Pages from '../pages';
import ProtectedRoute from './ProtectedRoute';
import LogoutRoute from './LogoutRoute';
import LoadingRoute from './LoadingRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layouts.AuthLayout />}>
                <Route element={<LoadingRoute />}>
                    <Route path={config.routes.login} element={<Pages.LoginPage />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<LoadingRoute />}>
                    <Route path={config.routes.logout} element={<LogoutRoute />} />
                    <Route element={<Layouts.AppLayout />}>
                        <Route path={config.routes.home} element={<Pages.HomePage />} />
                        {Object.values(Controllers).flatMap((controller) =>
                            controller.registeredRoutes.map((r) => (
                                <Route
                                    path={r.path}
                                    element={r.element ? <r.element controller={controller} /> : undefined}
                                />
                            )),
                        )}
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;

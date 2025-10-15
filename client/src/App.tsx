import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './config/routes';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PrivateRoute from './components/PrivateRoute';

import { LoginPage } from './pages/Login';
import { LogoutPage } from './pages/Logout';
import { HomePage } from './pages/Home';
import { ResourceMainPage } from './pages/ResourceMain';

import useAccessorie from './hooks/accessories/useAccessorie';
import useAsset from './hooks/assets/useAsset';
import useLicense from './hooks/licenses/useLicense';
import useUser from './hooks/users/useUser';

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
                        <Route
                            path={ROUTES.accessories.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Accessories"
                                    resourceUse={useAccessorie()}
                                />
                            }
                        />
                        <Route
                            path={ROUTES.assets.many}
                            element={
                                <ResourceMainPage 
                                    resourceName="Assets" 
                                    resourceUse={useAsset()} 
                                />
                            }
                        />
                        <Route
                            path={ROUTES.licenses.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Licenses"
                                    resourceUse={useLicense()}
                                />
                            }
                        />
                        <Route
                            path={ROUTES.users.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Users"
                                    resourceUse={useUser()}
                                />
                            }
                        />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './config/routes';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PrivateRoute from './components/PrivateRoute';

import { LoginPage } from './pages/Login';
import { LogoutPage } from './pages/Logout';
import { HomePage } from './pages/Home';
import { ResourceMainPage } from './pages/ResourceMain';

import useAccessories from './features/accessories/useAccessories';
import useAsset from './features/assets/useAsset';

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
                        // accessories
                        <Route
                            path={ROUTES.accessories.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Accessories"
                                    resourceUse={useAccessories()}
                                />
                            }
                        />
                        // accessories // assets
                        <Route
                            path={ROUTES.assets.many}
                            element={
                                <ResourceMainPage resourceName="Assets" resourceUse={useAsset()} />
                            }
                        />
                        // assets // licenses
                        <Route
                            path={ROUTES.licenses.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Licenses"
                                    resourceUse={useAccessories()}
                                />
                            }
                        />
                        // licenses // users
                        <Route
                            path={ROUTES.users.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Users"
                                    resourceUse={useAccessories()}
                                />
                            }
                        />
                        // users
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Config from './config/index';

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
                    <Route path={Config.Routes.auth.login} element={<LoginPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path={Config.Routes.auth.logout} element={<LogoutPage />} />

                    <Route element={<MainLayout />}>
                        <Route path={Config.Routes.home} element={<HomePage />} />
                        <Route
                            path={Config.Routes.accessories.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Accessories"
                                    resourceUse={useAccessorie()}
                                />
                            }
                        />
                        <Route
                            path={Config.Routes.assets.many}
                            element={
                                <ResourceMainPage 
                                    resourceName="Assets" 
                                    resourceUse={useAsset()} 
                                />
                            }
                        />
                        <Route
                            path={Config.Routes.licenses.many}
                            element={
                                <ResourceMainPage
                                    resourceName="Licenses"
                                    resourceUse={useLicense()}
                                />
                            }
                        />
                        <Route
                            path={Config.Routes.users.many}
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

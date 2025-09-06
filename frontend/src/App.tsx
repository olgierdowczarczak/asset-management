import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import LogoutPage from './pages/LogoutPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import UsersCreatePage from './pages/UsersCreatePage.tsx';
import AssetsPage from './pages/AssetsPage.tsx';
import AssetsCreatePage from './pages/AssetsCreatePage.tsx';
import AssetPage from './pages/AssetPage.tsx';
import UserPage from './pages/UserPage.tsx';
import LoggedRoute from './components/LoggedRoute.tsx';

export default function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/register' element={<LoggedRoute><RegisterPage /></LoggedRoute>} />
                <Route path='/login' element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                <Route path='/logout' element={<LogoutPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/users/:id' element={<UserPage />} />
                <Route path='/users/create' element={<UsersCreatePage />} />
                <Route path='/assets' element={<AssetsPage />} />
                <Route path='/assets/:id' element={<AssetPage />} />
                <Route path='/assets/create' element={<AssetsCreatePage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </BrowserRouter>
    )
};
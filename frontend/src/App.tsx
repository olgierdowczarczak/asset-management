import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import LogoutPage from './pages/LogoutPage.tsx';
import LoggedRoute from './components/LoggedRoute.tsx';

export default function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/register' element={<LoggedRoute><RegisterPage /></LoggedRoute>} />
                <Route path='/login' element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                <Route path='/logout' element={<LogoutPage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </BrowserRouter>
    )
}
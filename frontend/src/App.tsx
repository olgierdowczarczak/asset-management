import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import HomePage from './pages/HomePage.tsx';

export default function () {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

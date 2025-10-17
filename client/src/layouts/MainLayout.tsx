import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import styles from './styles/MainLayout.module.css';

export default function MainLayout() {
    return (
        <div className={styles.app}>
            <Navbar />
            <main className={styles.content}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

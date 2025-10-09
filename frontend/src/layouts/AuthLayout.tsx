import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import styles from './styles/AuthLayout.module.css';

export default function MainLayout() {
    return (
        <div className={styles.app}>
            <main className={styles.content}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

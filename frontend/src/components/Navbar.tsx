import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import styles from './styles/Navbar.module.css';

export default function Navbar() {
    const { user, isLoggedIn } = useAuth();
    return (
        <nav>
            <Logo />
            <div className={styles.links}>
                {isLoggedIn ? (
                    <>
                        <div className={styles['links-important']}>
                            <Link to='/accessories'>Accessories</Link>
                            <Link to='/assets'>Assets</Link>
                            <Link to='/licenses'>Licenses</Link>
                        </div>
                        <Link to='/me'>{user?.username}</Link>
                    </>
                ) : (
                    <Link to='/login'>Login</Link>
                )}
            </div>
        </nav>
    );
}

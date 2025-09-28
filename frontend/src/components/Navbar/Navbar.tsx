import { Link } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, isLoggedIn, isChecked } = useAuth();
    if (!isChecked) {
        return null;
    }
    return (
        <nav className={styles['app-nav']}>
            <Logo />
            <div className={styles.links}>
                {isLoggedIn ? (
                    <>
                        <div className={styles['links-important']}>
                            <Link to={ROUTES.accessories.many}>Accessories</Link>
                            <Link to={ROUTES.assets.many}>Assets</Link>
                            <Link to={ROUTES.licenses.many}>Licenses</Link>
                            <Link to={ROUTES.users.many}>Users</Link>
                        </div>
                        <Link to={`/users/${user?.id}`}>{user?.username}</Link>
                    </>
                ) : (
                    <Link to={ROUTES.auth.login}>Login</Link>
                )}
            </div>
        </nav>
    );
}

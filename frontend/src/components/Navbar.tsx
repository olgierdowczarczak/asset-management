import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from './styles/Navbar.module.css';

export default function Navbar() {
    return (
        <nav>
            <Logo />
            <div className={styles.links}>
                <Link to="/accessories">Accessories</Link>
                <Link to="/assets">Assets</Link>
                <Link to="/licenses">Licenses</Link>
            </div>
        </nav>
    );
}

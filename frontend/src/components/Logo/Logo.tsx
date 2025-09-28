import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

function Logo() {
    return (
        <Link to="/" className={styles['app-logo']}>
            <p>Logo</p>
        </Link>
    );
}

export default Logo;

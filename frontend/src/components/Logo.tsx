import { Link } from 'react-router-dom';
import styles from './styles/Logo.module.css';

function Logo() {
    return (
        <Link to="/" className={styles.logo}>
            <p>Logo</p>
        </Link>
    );
}

export default Logo;

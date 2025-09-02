import { Link } from 'react-router-dom';

type NavLink = {
    to: string;
    label: string;
}

export default function () {
    const links: NavLink[] = [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
        { to: '/logout', label: 'Logout' },
    ] as const;

    return (
        <nav>
            <ul>
                {links.map(({ to, label }) => (
                    <li key={to}>
                        <Link to={to}>{label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
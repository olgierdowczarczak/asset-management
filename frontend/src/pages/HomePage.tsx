import { Link } from 'react-router-dom';

type NavLink = {
    to: string;
    label: string;
};

function HomePage() {
    const links: NavLink[] = [
        { to: '/login', label: 'Login' },
        { to: '/logout', label: 'Logout' },
        { to: '/users', label: 'Users' },
        { to: '/assets', label: 'Assets' },
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
}

export default HomePage;

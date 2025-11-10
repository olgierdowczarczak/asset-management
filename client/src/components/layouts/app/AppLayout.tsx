import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
import config from '@/config';

function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Users', path: config.routes.users },
        { name: 'Assets', path: config.routes.assets },
        { name: 'Accessories', path: config.routes.accessories },
        { name: 'Licenses', path: config.routes.licenses },
    ];

    const handleLogout = async () => {
        await logout();
        navigate(config.routes.login);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } bg-gray-900 border-r border-gray-800 w-64`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="text-xl font-bold text-gray-100">
                            Asset Management
                        </h2>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-primary-900/30 text-primary-400 font-medium'
                                            : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary-900/30 flex items-center justify-center">
                                <span className="text-primary-400 font-semibold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-100 truncate">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="w-full text-sm"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            <div className={`transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;

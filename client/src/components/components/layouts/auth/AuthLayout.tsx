import { Outlet } from 'react-router-dom';
import { Card } from '@/components';

function AuthLayout() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
            <Card className="p-8 w-full max-w-md">
                <Outlet />
            </Card>
        </main>
    );
}

export default AuthLayout;

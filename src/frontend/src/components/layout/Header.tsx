import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export default function Header() {
    const currentView = useAppSelector((state) => state.ui.currentView);

    const navItems = [
        { path: '/', label: 'Dashboard', view: 'dashboard' },
        { path: '/generate', label: 'Generate', view: 'generate' },
        { path: '/chat', label: 'Chat', view: 'chat' },
        { path: '/settings', label: 'Settings', view: 'settings' },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl">✍️</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Blog Agent
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === item.view
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}

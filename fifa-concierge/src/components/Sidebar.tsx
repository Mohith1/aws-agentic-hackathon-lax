import React from 'react';
import { LayoutGrid, MessageSquare, MapPin, User, Bell, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemData {
    icon: React.ElementType;
    label: string;
    path: string;
}

const navItems: NavItemData[] = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
    { icon: MapPin, label: 'Venues', path: '/venues' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-lg">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-fifa-blue to-fifa-purple rounded-2xl flex items-center justify-center shadow-fifa">
                        <span className="text-2xl">⚽</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-fifa-blue">FIFA 2026</h1>
                        <p className="text-sm text-gray-500">AI Concierge</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem 
                        key={item.label} 
                        {...item} 
                        active={location.pathname === item.path}
                    />
                ))}
            </nav>

            {/* Match Day Alert */}
            <div className="m-4 p-4 bg-gradient-to-br from-fifa-red/10 to-[#FF1744]/5 border-2 border-fifa-red/20 rounded-2xl animate-pulse-glow">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-fifa-red rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-xl">⚽</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-fifa-dark mb-1">Match Day!</h3>
                        <p className="text-xs text-gray-600 mb-3 truncate">USA vs Mexico starts in 4 hours</p>
                        <button className="w-full bg-fifa-red hover:bg-[#A00D24] text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-fifa-gold to-[#FFA500] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-fifa-dark truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">🇺🇸 USA Fan</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-gray-400 hover:text-fifa-blue" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

interface NavItemProps extends NavItemData {
    active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            active
                ? 'bg-gradient-to-r from-fifa-blue to-fifa-purple text-white shadow-fifa'
                : 'text-gray-600 hover:bg-gray-50 hover:text-fifa-blue'
        }`}
    >
        <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        <span className="text-sm">{label}</span>
        {active && (
            <div className="ml-auto w-2 h-2 bg-fifa-gold rounded-full animate-pulse" />
        )}
    </Link>
);

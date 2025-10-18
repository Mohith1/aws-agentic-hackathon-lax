import React from 'react';
import { Car, UtensilsCrossed, Ticket, Navigation, Globe, Heart } from 'lucide-react';

interface Action {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    gradient: string;
    hoverGradient: string;
}

const actions: Action[] = [
    {
        id: 'ride',
        icon: Car,
        title: 'Book Ride',
        subtitle: 'Get to the stadium',
        gradient: 'from-fifa-blue to-[#0052CC]',
        hoverGradient: 'from-[#0052CC] to-fifa-blue'
    },
    {
        id: 'food',
        icon: UtensilsCrossed,
        title: 'Find Food',
        subtitle: 'Best local spots',
        gradient: 'from-fifa-teal to-[#00D4A1]',
        hoverGradient: 'from-[#00D4A1] to-fifa-teal'
    },
    {
        id: 'tickets',
        icon: Ticket,
        title: 'Get Tickets',
        subtitle: 'Available seats',
        gradient: 'from-fifa-gold to-[#FFA500]',
        hoverGradient: 'from-[#FFA500] to-fifa-gold'
    },
    {
        id: 'navigate',
        icon: Navigation,
        title: 'Navigate',
        subtitle: 'Interactive maps',
        gradient: 'from-fifa-purple to-[#9B4AB8]',
        hoverGradient: 'from-[#9B4AB8] to-fifa-purple'
    },
    {
        id: 'translate',
        icon: Globe,
        title: 'Translate',
        subtitle: 'Break barriers',
        gradient: 'from-fifa-red to-[#E61E3D]',
        hoverGradient: 'from-[#E61E3D] to-fifa-red'
    },
    {
        id: 'favorites',
        icon: Heart,
        title: 'My Events',
        subtitle: 'Saved matches',
        gradient: 'from-[#FF1744] to-[#FF5252]',
        hoverGradient: 'from-[#FF5252] to-[#FF1744]'
    }
];

export const QuickActions: React.FC = () => {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-fifa-blue to-fifa-purple rounded-full" />
                <h2 className="text-3xl font-bold text-fifa-dark">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {actions.map((action) => (
                    <ActionCard key={action.id} {...action} />
                ))}
            </div>
        </section>
    );
};

interface ActionCardProps {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    gradient: string;
    hoverGradient: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, subtitle, gradient, hoverGradient }) => (
    <button className="group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-fifa">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:opacity-0 transition-opacity duration-300`} />
        <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] animate-shimmer" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
            <Icon className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
            <h3 className="font-bold text-base mb-1">{title}</h3>
            <p className="text-xs text-white/80">{subtitle}</p>
        </div>

        {/* Border Glow */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-colors duration-300" />
    </button>
);

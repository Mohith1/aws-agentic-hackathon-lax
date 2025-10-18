import React from 'react';
import { Trophy, Calendar, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <div className="relative min-h-[500px] overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue via-fifa-purple to-fifa-blue">
                {/* Animated geometric patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-fifa-gold rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
                
                {/* FIFA Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center text-white space-y-6">
                    {/* Trophy Icon with Glow */}
                    <div className="inline-flex items-center justify-center w-24 h-24 glass rounded-full mb-6 shadow-2xl animate-float">
                        <Trophy className="w-12 h-12 text-fifa-gold" strokeWidth={2} />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight animate-fade-in">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-fifa-gold to-white">FIFA 2026</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl lg:text-2xl font-light text-white/90 max-w-3xl mx-auto animate-slide-up">
                        Your intelligent World Cup companion. Get personalized recommendations, 
                        real-time updates, and seamless event planning.
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                        <StatCard
                            icon={<span className="text-4xl">🇺🇸</span>}
                            label="Your Favorite Team"
                            value="USA"
                            gradient="from-[#B22234] to-[#3C3B6E]"
                        />
                        <StatCard
                            icon={<Calendar className="w-8 h-8" />}
                            label="Matches Saved"
                            value="3 Events"
                            gradient="from-fifa-teal to-fifa-purple"
                        />
                        <StatCard
                            icon={<MapPin className="w-8 h-8" />}
                            label="Days Until First Match"
                            value="245 Days"
                            gradient="from-fifa-gold to-fifa-red"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, gradient }) => (
    <div className="group relative animate-scale-in">
        {/* Glassmorphism Card */}
        <div className="relative glass rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-fifa">
            {/* Gradient Border Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />
            
            <div className="relative space-y-3">
                <div className="flex justify-center">
                    {icon}
                </div>
                <p className="text-white/70 text-sm font-medium">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

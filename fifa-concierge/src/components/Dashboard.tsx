import React from 'react';
import { Hero } from './Hero';
import { QuickActions } from './QuickActions';
import { UpcomingMatches } from './UpcomingMatches';

export const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-fifa-gray-100">
            {/* Hero Section */}
            <Hero />

            {/* Quick Actions Section */}
            <QuickActions />

            {/* Upcoming Matches Section */}
            <UpcomingMatches />

            {/* Additional Content Section */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fan Zone Card */}
                    <div className="bg-gradient-to-br from-fifa-gold to-[#FFA500] rounded-3xl p-8 text-white shadow-fifa hover:shadow-fifa-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl">🎉</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black mb-2">Fan Zone</h3>
                                <p className="text-white/90 mb-4">
                                    Connect with fellow fans, share experiences, and win exclusive FIFA merchandise!
                                </p>
                                <button className="bg-white text-fifa-gold font-bold py-2 px-6 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Travel Guide Card */}
                    <div className="bg-gradient-to-br from-fifa-teal to-[#00D4A1] rounded-3xl p-8 text-white shadow-fifa hover:shadow-fifa-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl">🗺️</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black mb-2">Travel Guide</h3>
                                <p className="text-white/90 mb-4">
                                    Explore host cities, book hotels, and discover local attractions with AI-powered recommendations.
                                </p>
                                <button className="bg-white text-fifa-teal font-bold py-2 px-6 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg">
                                    Explore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

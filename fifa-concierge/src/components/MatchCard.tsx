import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export interface Team {
    name: string;
    code: string;
    flag: string;
}

export interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    date: string;
    time: string;
    status: 'upcoming' | 'live' | 'finished';
}

interface MatchCardProps {
    match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    return (
        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
            {/* Status Banner */}
            {match.status === 'live' && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-fifa-red to-[#FF1744] py-2 px-4 z-10">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white font-bold text-sm uppercase tracking-wide">Live Now</span>
                    </div>
                </div>
            )}

            <div className={`p-6 ${match.status === 'live' ? 'pt-14' : ''}`}>
                {/* Teams */}
                <div className="flex items-center justify-between mb-6">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center space-y-3">
                        <div className="relative">
                            <img 
                                src={match.homeTeam.flag} 
                                alt={match.homeTeam.name}
                                className="w-20 h-20 object-cover rounded-full shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Flag Border Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue/20 to-transparent rounded-full blur-xl" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-fifa-dark">{match.homeTeam.name}</p>
                            <p className="text-sm text-gray-500">{match.homeTeam.code}</p>
                        </div>
                    </div>

                    {/* VS Divider */}
                    <div className="px-6">
                        <div className="relative">
                            <div className="text-3xl font-black text-fifa-blue">VS</div>
                            <div className="absolute inset-0 bg-gradient-to-r from-fifa-blue to-fifa-purple opacity-10 blur-2xl" />
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center space-y-3">
                        <div className="relative">
                            <img 
                                src={match.awayTeam.flag} 
                                alt={match.awayTeam.name}
                                className="w-20 h-20 object-cover rounded-full shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-fifa-red/20 to-transparent rounded-full blur-xl" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-fifa-dark">{match.awayTeam.name}</p>
                            <p className="text-sm text-gray-500">{match.awayTeam.code}</p>
                        </div>
                    </div>
                </div>

                {/* Match Details */}
                <div className="space-y-3 bg-gradient-to-br from-fifa-gray-100 to-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-fifa-blue" />
                        <span className="font-medium">{match.date}</span>
                        <Clock className="w-4 h-4 text-fifa-blue ml-auto" />
                        <span className="font-medium">{match.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-fifa-red" />
                        <span className="font-medium">{match.venue}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 bg-gradient-to-r from-fifa-blue to-fifa-purple hover:from-[#0052CC] hover:to-[#9B4AB8] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-fifa-lg hover:scale-105 active:scale-95">
                    View Details
                </button>
            </div>
        </div>
    );
};

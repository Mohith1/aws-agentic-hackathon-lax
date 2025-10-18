import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MatchCard, Match } from './MatchCard';

export const UpcomingMatches: React.FC = () => {
    const matches: Match[] = [
        {
            id: '1',
            homeTeam: { 
                name: 'USA', 
                code: 'USA', 
                flag: 'https://flagcdn.com/w160/us.png' 
            },
            awayTeam: { 
                name: 'Mexico', 
                code: 'MEX', 
                flag: 'https://flagcdn.com/w160/mx.png' 
            },
            venue: 'SoFi Stadium, Los Angeles',
            date: 'June 15, 2026',
            time: '7:00 PM PST',
            status: 'upcoming'
        },
        {
            id: '2',
            homeTeam: { 
                name: 'Brazil', 
                code: 'BRA', 
                flag: 'https://flagcdn.com/w160/br.png' 
            },
            awayTeam: { 
                name: 'Argentina', 
                code: 'ARG', 
                flag: 'https://flagcdn.com/w160/ar.png' 
            },
            venue: 'MetLife Stadium, New York',
            date: 'June 18, 2026',
            time: '8:00 PM EST',
            status: 'upcoming'
        },
        {
            id: '3',
            homeTeam: { 
                name: 'England', 
                code: 'ENG', 
                flag: 'https://flagcdn.com/w160/gb-eng.png' 
            },
            awayTeam: { 
                name: 'Germany', 
                code: 'GER', 
                flag: 'https://flagcdn.com/w160/de.png' 
            },
            venue: 'Rose Bowl, Pasadena',
            date: 'June 20, 2026',
            time: '6:00 PM PST',
            status: 'upcoming'
        }
    ];

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-fifa-blue to-fifa-purple rounded-full" />
                    <h2 className="text-3xl font-bold text-fifa-dark">Your Upcoming Matches</h2>
                </div>
                <button className="flex items-center gap-2 text-fifa-blue hover:text-fifa-purple font-semibold transition-colors group">
                    View All
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </section>
    );
};

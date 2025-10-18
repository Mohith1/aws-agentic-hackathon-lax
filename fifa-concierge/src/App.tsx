import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { VenueMap } from './components/VenueMap';

// Lightweight placeholder pages for Profile and Notifications
const ProfilePage: React.FC = () => (
  <div className="min-h-screen bg-fifa-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-fifa-gold to-[#FFA500] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-fifa">
            JD
          </div>
          <div>
            <h1 className="text-3xl font-black text-fifa-dark">John Doe</h1>
            <p className="text-gray-600">🇺🇸 USA Fan</p>
            <p className="text-sm text-gray-500 mt-1">FIFA ID: #2026-USA-12345</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-fifa-dark mb-3">Favorite Teams</h2>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-fifa-blue text-white rounded-xl font-semibold">🇺🇸 USA</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold">🇧🇷 Brazil</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-fifa-dark mb-3">Match History</h2>
            <p className="text-gray-600">You have attended 0 matches so far.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotificationsPage: React.FC = () => (
  <div className="min-h-screen bg-fifa-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-fifa-dark mb-6">Notifications</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-fifa-blue">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚽</span>
            <div className="flex-1">
              <h3 className="font-bold text-fifa-dark mb-1">Match Starting Soon!</h3>
              <p className="text-gray-600 text-sm">USA vs Mexico starts in 4 hours at SoFi Stadium</p>
              <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-fifa-gold">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🎟️</span>
            <div className="flex-1">
              <h3 className="font-bold text-fifa-dark mb-1">Ticket Confirmed</h3>
              <p className="text-gray-600 text-sm">Your tickets for Brazil vs Argentina have been confirmed!</p>
              <p className="text-xs text-gray-400 mt-2">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-fifa-gray-100">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/venues" element={<VenueMap />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

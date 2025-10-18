import React, { useState, useEffect } from 'react';
import { 
  Car, 
  UtensilsCrossed, 
  Ticket, 
  Navigation, 
  Languages, 
  Calendar 
} from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { VenueService } from '../../services/venueService';
import { DeepLinkService } from '../../services/deepLinkService';
import { Venue, QuickAction } from '../../types/quickActions';
import './QuickActions.css';

interface QuickActionsProps {
  selectedVenue?: Venue;
  onActionClick?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  selectedVenue, 
  onActionClick 
}) => {
  const [venue, setVenue] = useState<Venue>(
    selectedVenue || VenueService.getDefaultVenue()
  );
  const [savedEvents, setSavedEvents] = useState<number>(0);

  useEffect(() => {
    // Load saved events from localStorage
    const saved = localStorage.getItem('fifa_saved_events');
    if (saved) {
      try {
        const events = JSON.parse(saved);
        setSavedEvents(events.length || 0);
      } catch (err) {
        console.error('Failed to load saved events:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      setVenue(selectedVenue);
    }
  }, [selectedVenue]);

  const handleBookRide = () => {
    console.log('Opening ride booking to:', venue.name);
    DeepLinkService.openRideBooking(venue);
    onActionClick?.('book-ride');
  };

  const handleFindFood = () => {
    console.log('Opening Yelp for restaurants near:', venue.name);
    DeepLinkService.openYelp(venue);
    onActionClick?.('find-food');
  };

  const handleGetTickets = () => {
    console.log('Opening FIFA tickets page');
    DeepLinkService.openTickets();
    onActionClick?.('get-tickets');
  };

  const handleNavigate = () => {
    console.log('Opening navigation to:', venue.name);
    DeepLinkService.openNavigation(venue);
    onActionClick?.('navigate');
  };

  const handleTranslate = () => {
    console.log('Opening Google Translate');
    DeepLinkService.openTranslate(venue);
    onActionClick?.('translate');
  };

  const handleMyEvents = () => {
    console.log('Opening My Events');
    // TODO: Navigate to My Events page or open modal
    alert(`You have ${savedEvents} saved event${savedEvents !== 1 ? 's' : ''}`);
    onActionClick?.('my-events');
  };

  const actions: QuickAction[] = [
    {
      id: 'book-ride',
      title: 'Book a Ride',
      subtitle: `Uber to ${venue.city}`,
      icon: Car,
      color: '#000000',
      gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
      handler: handleBookRide
    },
    {
      id: 'find-food',
      title: 'Find Food',
      subtitle: 'Nearby Restaurants',
      icon: UtensilsCrossed,
      color: '#D32323',
      gradient: 'linear-gradient(135deg, #D32323 0%, #A51A1A 100%)',
      handler: handleFindFood
    },
    {
      id: 'get-tickets',
      title: 'Get Tickets',
      subtitle: 'Official FIFA Tickets',
      icon: Ticket,
      color: '#326295',
      gradient: 'linear-gradient(135deg, #326295 0%, #1E3A5F 100%)',
      handler: handleGetTickets
    },
    {
      id: 'navigate',
      title: 'Navigate',
      subtitle: `Directions to ${venue.name}`,
      icon: Navigation,
      color: '#4285F4',
      gradient: 'linear-gradient(135deg, #4285F4 0%, #2C5BA0 100%)',
      handler: handleNavigate
    },
    {
      id: 'translate',
      title: 'Translate',
      subtitle: 'Common Phrases',
      icon: Languages,
      color: '#34A853',
      gradient: 'linear-gradient(135deg, #34A853 0%, #1E7A32 100%)',
      handler: handleTranslate
    },
    {
      id: 'my-events',
      title: 'My Events',
      subtitle: `${savedEvents} Saved`,
      icon: Calendar,
      color: '#FBBC04',
      gradient: 'linear-gradient(135deg, #FBBC04 0%, #E8A600 100%)',
      handler: handleMyEvents
    }
  ];

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-header">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <p className="quick-actions-subtitle">
          Essential services for {venue.name}
        </p>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <QuickActionCard 
            key={action.id} 
            action={action} 
          />
        ))}
      </div>
    </div>
  );
};

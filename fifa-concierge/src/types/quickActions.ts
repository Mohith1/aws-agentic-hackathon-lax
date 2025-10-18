// TypeScript interfaces for Quick Actions
import { LucideIcon } from 'lucide-react';

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  placeId?: string; // Google Maps Place ID
  address: string;
  timezone: string;
  primaryLanguage: string;
}

export interface DeepLink {
  platform: 'ios' | 'android' | 'web' | 'all';
  app?: string;
  url: string;
  fallbackUrl?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon; // Lucide icon component
  color: string;
  gradient: string;
  handler: (venue?: Venue) => void;
}

export interface ActionContext {
  venue?: Venue;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  selectedMatch?: string;
  userLanguage?: string;
}

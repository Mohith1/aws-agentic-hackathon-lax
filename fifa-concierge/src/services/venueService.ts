// FIFA World Cup 2026 Venue Data Service

import { Venue } from '../types/quickActions';

export const FIFA_2026_VENUES: Venue[] = [
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    coordinates: { latitude: 33.9533, longitude: -118.3386 },
    placeId: 'ChIJLfySpTOsEmsRsc_JfJtljdc',
    address: '1001 Stadium Dr, Inglewood, CA 90301',
    timezone: 'America/Los_Angeles',
    primaryLanguage: 'en'
  },
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'USA',
    coordinates: { latitude: 40.8135, longitude: -74.0745 },
    placeId: 'ChIJrw7QBK9ZwokRvHvjSI0N6qs',
    address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
    timezone: 'America/New_York',
    primaryLanguage: 'en'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    coordinates: { latitude: 19.3030, longitude: -99.1506 },
    placeId: 'ChIJcUMn_0QB0oURSQWdK-MIksE',
    address: 'Calz. de Tlalpan 3465, Santa Úrsula Coapa, Mexico City',
    timezone: 'America/Mexico_City',
    primaryLanguage: 'es'
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Arlington',
    country: 'USA',
    coordinates: { latitude: 32.7473, longitude: -97.0945 },
    placeId: 'ChIJ0wa8th2uToYRXU3Xq7jN8hE',
    address: '1 AT&T Way, Arlington, TX 76011',
    timezone: 'America/Chicago',
    primaryLanguage: 'en'
  },
  {
    id: 'arrowhead',
    name: 'Arrowhead Stadium',
    city: 'Kansas City',
    country: 'USA',
    coordinates: { latitude: 39.0489, longitude: -94.4839 },
    placeId: 'ChIJ_3_TdlewwIcRVaD1SQK8GYY',
    address: '1 Arrowhead Dr, Kansas City, MO 64129',
    timezone: 'America/Chicago',
    primaryLanguage: 'en'
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    country: 'USA',
    coordinates: { latitude: 33.7554, longitude: -84.4008 },
    placeId: 'ChIJdWxa1SR-9YgRDG_kDsOgRd4',
    address: '1 AMB Dr NW, Atlanta, GA 30313',
    timezone: 'America/New_York',
    primaryLanguage: 'en'
  },
  {
    id: 'lumen',
    name: 'Lumen Field',
    city: 'Seattle',
    country: 'USA',
    coordinates: { latitude: 47.5952, longitude: -122.3316 },
    placeId: 'ChIJOzgGm0pqkFQRJQhfQ3SkPPE',
    address: '800 Occidental Ave S, Seattle, WA 98134',
    timezone: 'America/Los_Angeles',
    primaryLanguage: 'en'
  },
  {
    id: 'bc-place',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    coordinates: { latitude: 49.2768, longitude: -123.1119 },
    placeId: 'ChIJZdfacCFzhlQRofcvRNFPDdI',
    address: '777 Pacific Blvd, Vancouver, BC V6B 4Y8',
    timezone: 'America/Vancouver',
    primaryLanguage: 'en'
  },
  {
    id: 'bmo',
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    coordinates: { latitude: 43.6332, longitude: -79.4189 },
    placeId: 'ChIJ7cvzKLs0K4gRfjZ2Hk9wZVk',
    address: '170 Princes Blvd, Toronto, ON M6K 3C3',
    timezone: 'America/Toronto',
    primaryLanguage: 'en'
  },
  {
    id: 'bbva',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'Mexico',
    coordinates: { latitude: 25.7209, longitude: -100.2881 },
    placeId: 'ChIJa4MRPDKYZ4YR_dCvBKxYNKw',
    address: 'Av. Pablo Livas 2011, Monterrey, NL',
    timezone: 'America/Monterrey',
    primaryLanguage: 'es'
  },
  {
    id: 'akron',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'Mexico',
    coordinates: { latitude: 20.6906, longitude: -103.4639 },
    placeId: 'ChIJb_y3Z-mNKYQRR5hYXdRcGK0',
    address: 'Av. Estadio 2375, Guadalajara, JAL',
    timezone: 'America/Mexico_City',
    primaryLanguage: 'es'
  }
];

export class VenueService {
  private static defaultVenue: Venue = FIFA_2026_VENUES[0]; // SoFi Stadium

  /**
   * Get venue by ID
   */
  static getVenueById(id: string): Venue | undefined {
    return FIFA_2026_VENUES.find(v => v.id === id);
  }

  /**
   * Get venue by city name
   */
  static getVenueByCity(city: string): Venue | undefined {
    const normalizedCity = city.toLowerCase().trim();
    return FIFA_2026_VENUES.find(v => 
      v.city.toLowerCase().includes(normalizedCity) ||
      normalizedCity.includes(v.city.toLowerCase())
    );
  }

  /**
   * Get all venues for a country
   */
  static getVenuesByCountry(country: string): Venue[] {
    const normalizedCountry = country.toLowerCase();
    return FIFA_2026_VENUES.filter(v => 
      v.country.toLowerCase() === normalizedCountry
    );
  }

  /**
   * Get the default venue (SoFi Stadium)
   */
  static getDefaultVenue(): Venue {
    return this.defaultVenue;
  }

  /**
   * Get all venues
   */
  static getAllVenues(): Venue[] {
    return [...FIFA_2026_VENUES];
  }

  /**
   * Find nearest venue based on coordinates
   */
  static findNearestVenue(latitude: number, longitude: number): Venue {
    let nearestVenue = this.defaultVenue;
    let minDistance = Infinity;

    FIFA_2026_VENUES.forEach(venue => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        venue.coordinates.latitude,
        venue.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestVenue = venue;
      }
    });

    return nearestVenue;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

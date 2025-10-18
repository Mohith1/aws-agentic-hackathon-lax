// Deep Link Service - Generate URLs for external services

import { Venue } from '../types/quickActions';

export class DeepLinkService {
  /**
   * Detect if user is on mobile device
   */
  private static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Detect iOS
   */
  private static isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /**
   * Detect Android
   */
  private static isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  /**
   * Open a deep link with fallback
   */
  private static openLink(deepLink: string, fallbackUrl: string, newTab = true): void {
    if (this.isMobile()) {
      // Try to open deep link
      window.location.href = deepLink;
      
      // Fallback to web version after timeout
      setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 1500);
    } else {
      // Desktop: open web version in new tab
      window.open(fallbackUrl, newTab ? '_blank' : '_self', 'noopener,noreferrer');
    }
  }

  /**
   * Generate Uber ride link
   */
  static generateUberLink(venue: Venue): string {
    const { latitude, longitude } = venue.coordinates;
    const dropoffName = encodeURIComponent(venue.name);

    if (this.isMobile()) {
      // Try Uber app deep link first
      return `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${dropoffName}`;
    }

    // Web fallback
    return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${dropoffName}`;
  }

  /**
   * Generate Uber link from plain-text addresses (start and destination).
   * Uses app deep link on mobile and web fallback for desktop/mobile web.
   */
  static generateUberLinkFromAddress(startAddress: string | null, destinationAddress: string): string {
    const pickup = startAddress ? encodeURIComponent(startAddress) : 'my_location';
    const dropoff = encodeURIComponent(destinationAddress);

    if (this.isMobile()) {
      // Try Uber app deep link with formatted addresses
      return `uber://?action=setPickup&pickup[formatted_address]=${pickup}&dropoff[formatted_address]=${dropoff}`;
    }

    // Web fallback
    return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${pickup}&dropoff[formatted_address]=${dropoff}`;
  }

  /**
   * Generate Lyft link from plain-text addresses (start and destination).
   */
  static generateLyftLinkFromAddress(startAddress: string | null, destinationAddress: string): string {
    const pickup = startAddress ? encodeURIComponent(startAddress) : 'my_location';
    const dropoff = encodeURIComponent(destinationAddress);

    if (this.isMobile()) {
      // Lyft app deep link with pickup and destination addresses
      return `lyft://ridetype?id=lyft&pickup=address:${pickup}&destination=address:${dropoff}`;
    }

    // Web fallback
    return `https://www.lyft.com/ride?pickup=${pickup}&destination=${dropoff}`;
  }

  /**
   * Open ride booking using plain-text addresses. Uses Uber only.
   */
  static openRideBookingFromAddresses(provider: 'uber', startAddress: string | null, destinationAddress: string): void {
    const uberLink = this.generateUberLinkFromAddress(startAddress, destinationAddress);
    const uberWeb = `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${startAddress ? encodeURIComponent(startAddress) : 'my_location'}&dropoff[formatted_address]=${encodeURIComponent(destinationAddress)}`;
    
    this.openLink(uberLink, uberWeb);
  }

  /**
   * Generate Lyft ride link
   */
  static generateLyftLink(venue: Venue): string {
    const { latitude, longitude } = venue.coordinates;

    if (this.isMobile()) {
      return `lyft://ridetype?id=lyft&destination[latitude]=${latitude}&destination[longitude]=${longitude}`;
    }

    return `https://www.lyft.com/ride?destination[latitude]=${latitude}&destination[longitude]=${longitude}`;
  }

  /**
   * Open ride booking (Uber only)
   */
  static openRideBooking(venue: Venue): void {
    const uberLink = this.generateUberLink(venue);
    const uberWeb = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${venue.coordinates.latitude}&dropoff[longitude]=${venue.coordinates.longitude}&dropoff[nickname]=${encodeURIComponent(venue.name)}`;

    this.openLink(uberLink, uberWeb);
  }

  /**
   * Generate Yelp restaurant search link
   */
  static generateYelpLink(venue: Venue): string {
    const { latitude, longitude } = venue.coordinates;
    const location = encodeURIComponent(`${venue.city}, ${venue.country}`);

    if (this.isMobile()) {
      // Yelp app deep link
      return `yelp:///search?terms=restaurants&ll=${latitude},${longitude}`;
    }

    // Yelp web
    return `https://www.yelp.com/search?find_desc=restaurants&ll=${latitude},${longitude}&attrs=RestaurantsReservations,RestaurantsDelivery`;
  }

  /**
   * Open Yelp for restaurants near venue
   */
  static openYelp(venue: Venue): void {
    const yelpApp = this.generateYelpLink(venue);
    const yelpWeb = `https://www.yelp.com/search?find_desc=restaurants&ll=${venue.coordinates.latitude},${venue.coordinates.longitude}`;

    this.openLink(yelpApp, yelpWeb);
  }

  /**
   * Generate FIFA official tickets link
   */
  static generateTicketsLink(): string {
    return 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/tickets';
  }

  /**
   * Open FIFA tickets page
   */
  static openTickets(): void {
    const officialLink = this.generateTicketsLink();
    window.open(officialLink, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generate Google Maps navigation link
   */
  static generateGoogleMapsLink(venue: Venue): string {
    const destination = encodeURIComponent(venue.name);
    const { latitude, longitude } = venue.coordinates;

    if (this.isMobile()) {
      if (this.isIOS()) {
        // Try Google Maps app, fallback to Apple Maps
        return `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
      }
      if (this.isAndroid()) {
        return `google.navigation:q=${latitude},${longitude}`;
      }
    }

    // Web version
    if (venue.placeId) {
      return `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${venue.placeId}`;
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  /**
   * Generate Apple Maps link
   */
  static generateAppleMapsLink(venue: Venue): string {
    const destination = encodeURIComponent(venue.name);
    const { latitude, longitude } = venue.coordinates;

    return `https://maps.apple.com/?daddr=${destination}&ll=${latitude},${longitude}&dirflg=d`;
  }

  /**
   * Generate Waze link
   */
  static generateWazeLink(venue: Venue): string {
    const { latitude, longitude } = venue.coordinates;
    return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  }

  /**
   * Open navigation to venue
   */
  static openNavigation(venue: Venue): void {
    const googleMaps = this.generateGoogleMapsLink(venue);
    const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.latitude},${venue.coordinates.longitude}`;

    if (this.isMobile()) {
      // Try app-specific links
      window.location.href = googleMaps;
      
      // Fallback to web after timeout
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          window.location.href = webFallback;
        }
      }, 1500);
    } else {
      // Desktop: open Google Maps web
      window.open(webFallback, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Generate Google Translate link
   */
  static generateTranslateLink(
    sourceLang: string = 'auto',
    targetLang: string = 'es',
    text: string = ''
  ): string {
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodedText}&op=translate`;
  }

  /**
   * Open Google Translate
   */
  static openTranslate(venue?: Venue, text: string = ''): void {
    // Default to Spanish for Mexico venues, English for others
    const targetLang = venue?.country === 'Mexico' ? 'es' : 
                       venue?.country === 'Canada' || venue?.country === 'USA' ? 'en' : 'es';
    
    const translateUrl = this.generateTranslateLink('auto', targetLang, text);
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generate common FIFA phrases in target language
   */
  static getFIFAPhrases(targetLang: string): { [key: string]: string } {
    const phrases: { [lang: string]: { [key: string]: string } } = {
      es: {
        'Where is the bathroom?': '¿Dónde está el baño?',
        'How much does this cost?': '¿Cuánto cuesta esto?',
        'Where is the nearest metro?': '¿Dónde está el metro más cercano?',
        'I need help': 'Necesito ayuda',
        'What time is the match?': '¿A qué hora es el partido?',
        'Where can I buy tickets?': '¿Dónde puedo comprar boletos?',
      },
      en: {
        'Where is the bathroom?': 'Where is the bathroom?',
        'How much does this cost?': 'How much does this cost?',
        'Where is the nearest metro?': 'Where is the nearest metro?',
        'I need help': 'I need help',
        'What time is the match?': 'What time is the match?',
        'Where can I buy tickets?': 'Where can I buy tickets?',
      },
      fr: {
        'Where is the bathroom?': 'Où sont les toilettes?',
        'How much does this cost?': 'Combien ça coûte?',
        'Where is the nearest metro?': 'Où est le métro le plus proche?',
        'I need help': 'J\'ai besoin d\'aide',
        'What time is the match?': 'À quelle heure est le match?',
        'Where can I buy tickets?': 'Où puis-je acheter des billets?',
      }
    };

    return phrases[targetLang] || phrases['en'];
  }

  /**
   * Share current page/event
   */
  static async share(title: string, text: string, url: string): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }
}

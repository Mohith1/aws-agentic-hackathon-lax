/**
 * Intent Detection Service
 * Analyzes user messages to detect booking intents and extract relevant information
 */

export interface Location {
  name: string;
  address?: string;
}

export interface BookingIntent {
  type: 'uber' | 'lyft' | 'ticket' | 'restaurant' | 'hotel' | 'translate' | 'directions' | null;
  confidence: number;
  startLocation?: Location;
  destination?: Location;
  query?: string;
  language?: string;
  originalText: string;
}

/**
 * Keywords that indicate different booking intents
 */
const INTENT_KEYWORDS = {
  uber: ['uber', 'ride share', 'rideshare', 'ride to', 'get a ride'],
  lyft: ['lyft', 'ride share', 'rideshare'],
  ticket: ['ticket', 'tickets', 'buy ticket', 'purchase ticket', 'book ticket'],
  restaurant: ['restaurant', 'food', 'eat', 'dining', 'dinner', 'lunch', 'breakfast', 'yelp'],
  hotel: ['hotel', 'accommodation', 'stay', 'book hotel', 'lodging'],
  translate: ['translate', 'translation', 'how do you say', 'what does', 'mean in'],
  directions: ['directions', 'navigate', 'how to get to', 'route to', 'drive to', 'walk to'],
};

/**
 * Location keywords and patterns
 */
const LOCATION_PATTERNS = {
  from: /(?:from|starting from|start at|pickup from|pick up from|leaving from)\s+(.+?)(?:\s+to|\s+and|$)/i,
  to: /(?:to|going to|destination|drop off at|drop-off at|heading to|arrive at)\s+(.+?)(?:\.|$|,)/i,
  between: /(?:from|between)\s+(.+?)\s+(?:to|and)\s+(.+?)(?:\.|$|,)/i,
};

/**
 * Common FIFA 2026 venues and locations
 */
const KNOWN_LOCATIONS = [
  'MetLife Stadium', 'SoFi Stadium', 'AT&T Stadium', 'Arrowhead Stadium',
  'Mercedes-Benz Stadium', 'NRG Stadium', 'Hard Rock Stadium', 'Lincoln Financial Field',
  'Levi\'s Stadium', 'Gillette Stadium', 'Estadio Azteca',
  'LAX', 'LAX Airport', 'Los Angeles Airport',
  'JFK', 'JFK Airport',
  'Amazon Santa Monica', 'Santa Monica',
  'Downtown LA', 'Hollywood',
  'Manhattan', 'Times Square',
  'Mexico City', 'Toronto', 'Vancouver',
];

/**
 * Detect the primary intent from a user message
 */
export function detectIntent(message: string): BookingIntent {
  const lowerMessage = message.toLowerCase();
  
  // Check each intent type
  for (const [intentType, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        const intent: BookingIntent = {
          type: intentType as BookingIntent['type'],
          confidence: calculateConfidence(lowerMessage, keyword),
          originalText: message,
        };

        // Extract locations for ride services
        if (intentType === 'uber' || intentType === 'lyft' || intentType === 'directions') {
          const locations = extractLocations(message);
          intent.startLocation = locations.start;
          intent.destination = locations.destination;
        }

        // Extract query for restaurants
        if (intentType === 'restaurant') {
          intent.query = extractRestaurantQuery(message);
          intent.destination = extractLocations(message).destination;
        }

        // Extract language for translation
        if (intentType === 'translate') {
          intent.language = extractLanguage(message);
          intent.query = extractTranslationQuery(message);
        }

        return intent;
      }
    }
  }

  // No intent detected
  return {
    type: null,
    confidence: 0,
    originalText: message,
  };
}

/**
 * Extract start and destination locations from message
 */
function extractLocations(message: string): { start?: Location; destination?: Location } {
  const result: { start?: Location; destination?: Location } = {};

  // Try to match "from X to Y" pattern
  const betweenMatch = message.match(LOCATION_PATTERNS.between);
  if (betweenMatch) {
    result.start = { name: betweenMatch[1].trim() };
    result.destination = { name: betweenMatch[2].trim() };
    return result;
  }

  // Try individual patterns
  const fromMatch = message.match(LOCATION_PATTERNS.from);
  if (fromMatch) {
    result.start = { name: fromMatch[1].trim() };
  }

  const toMatch = message.match(LOCATION_PATTERNS.to);
  if (toMatch) {
    result.destination = { name: toMatch[1].trim() };
  }

  // If no pattern matched, try to find known locations
  if (!result.start && !result.destination) {
    const foundLocations = findKnownLocations(message);
    if (foundLocations.length >= 2) {
      result.start = { name: foundLocations[0] };
      result.destination = { name: foundLocations[1] };
    } else if (foundLocations.length === 1) {
      result.destination = { name: foundLocations[0] };
    }
  }

  return result;
}

/**
 * Find known locations in the message
 */
function findKnownLocations(message: string): string[] {
  const found: string[] = [];
  const lowerMessage = message.toLowerCase();

  for (const location of KNOWN_LOCATIONS) {
    if (lowerMessage.includes(location.toLowerCase())) {
      found.push(location);
    }
  }

  return found;
}

/**
 * Extract restaurant search query
 */
function extractRestaurantQuery(message: string): string {
  const patterns = [
    /(?:find|search for|looking for|want)\s+(?:a\s+)?(.+?)\s+(?:restaurant|food|place to eat)/i,
    /(?:restaurant|food|dining)\s+(?:for|near|around)\s+(.+?)(?:\.|$)/i,
    /(.+?)\s+(?:restaurant|food|cuisine)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return 'restaurants';
}

/**
 * Extract language from translation request
 */
function extractLanguage(message: string): string {
  const languagePatterns = [
    /(?:in|to)\s+(spanish|french|german|italian|portuguese|japanese|chinese|korean|arabic)/i,
    /(spanish|french|german|italian|portuguese|japanese|chinese|korean|arabic)\s+translation/i,
  ];

  for (const pattern of languagePatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return 'spanish'; // Default for FIFA context
}

/**
 * Extract text to translate
 */
function extractTranslationQuery(message: string): string {
  const patterns = [
    /translate\s+"(.+?)"/i,
    /translate\s+(.+?)\s+(?:to|in)/i,
    /how do you say\s+"?(.+?)"?\s+in/i,
    /what does\s+"?(.+?)"?\s+mean/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return message;
}

/**
 * Calculate confidence score based on keyword match and context
 */
function calculateConfidence(message: string, keyword: string): number {
  let confidence = 0.6; // Base confidence

  // Increase confidence if exact keyword match
  if (message.includes(keyword)) {
    confidence += 0.2;
  }

  // Increase confidence if action words present
  const actionWords = ['book', 'get', 'need', 'want', 'find', 'search', 'looking for'];
  for (const action of actionWords) {
    if (message.toLowerCase().includes(action)) {
      confidence += 0.1;
      break;
    }
  }

  // Increase confidence if location words present
  const locationWords = ['from', 'to', 'at', 'near', 'around'];
  for (const loc of locationWords) {
    if (message.toLowerCase().includes(loc)) {
      confidence += 0.1;
      break;
    }
  }

  return Math.min(confidence, 1.0);
}

/**
 * Check if an intent has enough information to execute
 */
export function isIntentActionable(intent: BookingIntent): boolean {
  if (!intent.type || intent.confidence < 0.6) {
    return false;
  }

  switch (intent.type) {
    case 'uber':
    case 'lyft':
      // Need at least a destination
      return !!intent.destination;
    
    case 'directions':
      // Need at least a destination
      return !!intent.destination;
    
    case 'restaurant':
      // Need either a query or destination
      return !!(intent.query || intent.destination);
    
    case 'translate':
      // Need text to translate
      return !!intent.query;
    
    case 'ticket':
    case 'hotel':
      // Can proceed with general search
      return true;
    
    default:
      return false;
  }
}

/**
 * Format intent for display
 */
export function formatIntentSummary(intent: BookingIntent): string {
  if (!intent.type) {
    return '';
  }

  switch (intent.type) {
    case 'uber':
    case 'lyft':
      const service = intent.type.charAt(0).toUpperCase() + intent.type.slice(1);
      if (intent.startLocation && intent.destination) {
        return `${service} from ${intent.startLocation.name} to ${intent.destination.name}`;
      } else if (intent.destination) {
        return `${service} to ${intent.destination.name}`;
      }
      return `${service} ride`;
    
    case 'restaurant':
      if (intent.query && intent.destination) {
        return `${intent.query} restaurants near ${intent.destination.name}`;
      } else if (intent.query) {
        return `${intent.query} restaurants`;
      } else if (intent.destination) {
        return `Restaurants near ${intent.destination.name}`;
      }
      return 'Restaurant search';
    
    case 'directions':
      if (intent.startLocation && intent.destination) {
        return `Directions from ${intent.startLocation.name} to ${intent.destination.name}`;
      } else if (intent.destination) {
        return `Directions to ${intent.destination.name}`;
      }
      return 'Get directions';
    
    case 'translate':
      if (intent.query && intent.language) {
        return `Translate "${intent.query}" to ${intent.language}`;
      }
      return 'Translation';
    
    case 'ticket':
      return 'FIFA 2026 tickets';
    
    case 'hotel':
      return 'Find accommodation';
    
    default:
      return '';
  }
}

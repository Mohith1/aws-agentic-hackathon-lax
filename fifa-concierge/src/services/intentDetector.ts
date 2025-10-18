/**
 * Simple client-side intent detector for quick actions.
 * Detects rides, restaurants, places, translations, tickets, and navigation.
 * Extracts relevant context from plain text using pragmatic regexes.
 */

export type IntentType = 'ride' | 'restaurant' | 'place' | 'translate' | 'tickets' | 'navigate';

export interface Intent {
  type: IntentType;
  data: any;
}

export interface RideIntent {
  provider: 'uber';
  start: string | null;
  destination: string | null;
}

export interface RestaurantIntent {
  searchTerm: string;
  location: string | null;
}

export interface PlaceIntent {
  placeName: string;
}

export interface TranslateIntent {
  text: string;
  targetLang: string | null;
}

export interface NavigateIntent {
  destination: string;
}

export function detectRideIntent(text: string): RideIntent | null {
  const lower = text.toLowerCase();

  // Only proceed if user mentions ride intents (Uber only now)
  const mentionsUber = /\buber\b/.test(lower);
  const mentionsRide = /\b(ride|taxi|cab|drive|pickup|drop off)\b/.test(lower);
  
  if (!mentionsUber && !mentionsRide) return null;

  // Attempt to parse 'from X to Y' or 'to Y from X'
  // Examples handled: "book an uber from Amazon santa monica to LAX airport"
  const fromToRegex = /from\s+([^,]+?)\s+(?:to|->)\s+(.+)$/i;
  const toFromRegex = /to\s+([^,]+?)\s+from\s+(.+)$/i;
  const simpleToRegex = /to\s+(.+?)$/i;

  let start: string | null = null;
  let destination: string | null = null;

  const fmatch = text.match(fromToRegex);
  if (fmatch) {
    start = fmatch[1].trim();
    destination = fmatch[2].trim();
  } else {
    const rmatch = text.match(toFromRegex);
    if (rmatch) {
      destination = rmatch[1].trim();
      start = rmatch[2].trim();
    } else {
      const smatch = text.match(simpleToRegex);
      if (smatch) {
        destination = smatch[1].trim();
      }
    }
  }

  // Normalize known short names (LAX -> LAX Airport)
  if (destination && /\blax\b/i.test(destination) && !/airport/i.test(destination)) {
    destination = destination.replace(/\b(lax)\b/i, 'LAX Airport');
  }

  // Strip trailing punctuation from captures (e.g., "LAX airport.")
  const stripTrailing = (s: string | null) => s ? s.replace(/[.,!?;:\s]+$/g, '').trim() : s;
  start = stripTrailing(start);
  destination = stripTrailing(destination);

  if (!destination) return null;

  return { provider: 'uber', start, destination };
}

/**
 * Detect restaurant search intent
 * Examples: "find restaurants", "where can I eat", "best pizza near me"
 */
export function detectRestaurantIntent(text: string): RestaurantIntent | null {
  const lower = text.toLowerCase();
  
  const restaurantKeywords = /\b(restaurant|food|eat|dining|lunch|dinner|breakfast|cafe|pizza|burger|sushi|mexican|italian|chinese)\b/i;
  const searchKeywords = /\b(find|search|looking for|where|best|good|recommend)\b/i;
  
  if (!restaurantKeywords.test(lower)) return null;
  
  // Extract search term (cuisine type or food)
  const cuisineMatch = text.match(/\b(pizza|burger|sushi|mexican|italian|chinese|thai|indian|japanese|korean|french|american|seafood|steakhouse|vegan|vegetarian)\b/i);
  const searchTerm = cuisineMatch ? cuisineMatch[0] : 'restaurants';
  
  // Extract location if mentioned
  const nearMatch = text.match(/\bnear\s+([^,\.]+)/i);
  const inMatch = text.match(/\bin\s+([^,\.]+)/i);
  const location = nearMatch ? nearMatch[1].trim() : inMatch ? inMatch[1].trim() : null;
  
  return { searchTerm, location };
}

/**
 * Detect place/attraction intent
 * Examples: "show me LAX stadium", "where is the venue", "take me to SoFi Stadium"
 */
export function detectPlaceIntent(text: string): PlaceIntent | null {
  const lower = text.toLowerCase();
  
  const placeKeywords = /\b(stadium|venue|arena|place|attraction|museum|park|landmark|sight)\b/i;
  const actionKeywords = /\b(show|find|where|visit|go to|take me|direction)\b/i;
  
  if (!placeKeywords.test(lower) && !actionKeywords.test(lower)) return null;
  
  // Extract place name
  const stadiumMatch = text.match(/\b([A-Z][A-Za-z\s]+(?:Stadium|Arena|Field|Park|Center|Centre))/);
  if (stadiumMatch) {
    return { placeName: stadiumMatch[0].trim() };
  }
  
  // Try to extract any capitalized place name
  const placeMatch = text.match(/\b([A-Z][A-Za-z\s]{2,})/);
  if (placeMatch) {
    return { placeName: placeMatch[0].trim() };
  }
  
  return null;
}

/**
 * Detect translation intent
 * Examples: "translate hello to spanish", "how do I say bathroom in spanish"
 */
export function detectTranslateIntent(text: string): TranslateIntent | null {
  const lower = text.toLowerCase();
  
  const translateKeywords = /\b(translate|translation|how do i say|how to say|say in|speak)\b/i;
  
  if (!translateKeywords.test(lower)) return null;
  
  // Extract target language
  const langMatch = text.match(/\b(spanish|french|english|german|italian|portuguese|chinese|japanese|korean|arabic)\b/i);
  const targetLang = langMatch ? langMatch[0].toLowerCase() : null;
  
  // Extract text to translate
  let textToTranslate = '';
  const quoteMatch = text.match(/["']([^"']+)["']/);
  if (quoteMatch) {
    textToTranslate = quoteMatch[1];
  } else {
    // Try to extract text after "translate"
    const afterTranslate = text.match(/translate\s+(.+?)(?:\s+to\s+|\s+in\s+|$)/i);
    if (afterTranslate) {
      textToTranslate = afterTranslate[1].trim();
    }
  }
  
  return { text: textToTranslate, targetLang };
}

/**
 * Detect tickets intent
 * Examples: "buy tickets", "where can I get tickets", "ticket prices"
 */
export function detectTicketsIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return /\b(ticket|tickets|buy ticket|purchase ticket|ticket price)\b/i.test(lower);
}

/**
 * Detect navigation intent
 * Examples: "navigate to LAX", "directions to the stadium", "how do I get to"
 */
export function detectNavigateIntent(text: string): NavigateIntent | null {
  const lower = text.toLowerCase();
  
  const navKeywords = /\b(navigate|navigation|directions|route|how do i get|take me to|drive to)\b/i;
  
  if (!navKeywords.test(lower)) return null;
  
  // Extract destination
  const toMatch = text.match(/\b(?:to|toward|towards)\s+([^,\.]+)/i);
  if (toMatch) {
    return { destination: toMatch[1].trim() };
  }
  
  return null;
}

/**
 * Main intent detection function - returns the first matching intent
 */
export function detectIntent(text: string): Intent | null {
  // Check in priority order
  const rideIntent = detectRideIntent(text);
  if (rideIntent) return { type: 'ride', data: rideIntent };
  
  const restaurantIntent = detectRestaurantIntent(text);
  if (restaurantIntent) return { type: 'restaurant', data: restaurantIntent };
  
  const translateIntent = detectTranslateIntent(text);
  if (translateIntent) return { type: 'translate', data: translateIntent };
  
  const navIntent = detectNavigateIntent(text);
  if (navIntent) return { type: 'navigate', data: navIntent };
  
  const placeIntent = detectPlaceIntent(text);
  if (placeIntent) return { type: 'place', data: placeIntent };
  
  if (detectTicketsIntent(text)) return { type: 'tickets', data: {} };
  
  return null;
}

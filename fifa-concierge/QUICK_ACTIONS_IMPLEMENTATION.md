# Quick Actions Implementation Plan

## Overview
Implement 6 Quick Action cards that provide deep-link integrations to popular services for FIFA World Cup 2026 attendees.

---

## Architecture

### 1. Component Structure
```
src/
├── components/
│   ├── QuickActions/
│   │   ├── QuickActions.tsx          # Main container
│   │   ├── QuickActionCard.tsx       # Individual action card
│   │   └── QuickActions.css          # Styling
├── services/
│   ├── deepLinkService.ts            # Generate deep links
│   └── venueService.ts               # Venue/stadium data
└── types/
    └── quickActions.ts                # TypeScript interfaces
```

---

## Features Breakdown

### 1. **Book Ride** (Blue)
- **Primary**: Uber deep link with SoFi Stadium as destination
- **Fallback**: Lyft deep link
- **Mobile**: Opens native app if installed
- **Desktop**: Opens web version

**Deep Links:**
- Uber: `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=33.9533&dropoff[longitude]=-118.3386&dropoff[nickname]=SoFi%20Stadium`
- Uber Web: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=33.9533&dropoff[longitude]=-118.3386`
- Lyft: `lyft://ridetype?id=lyft&destination[latitude]=33.9533&destination[longitude]=-118.3386`

### 2. **Find Food** (Teal)
- **Primary**: Yelp search for restaurants near venue
- **Query**: "restaurants near [venue_name]"
- **Filters**: Open now, rating >4.0

**Deep Links:**
- Yelp App: `yelp:///search?terms=restaurants&ll=33.9533,-118.3386`
- Yelp Web: `https://www.yelp.com/search?find_desc=restaurants&ll=33.9533,-118.3386`

### 3. **Get Tickets** (Yellow)
- **Primary**: FIFA official ticketing portal
- **Fallback**: Ticketmaster for specific matches
- **Context-aware**: Link to specific match if selected

**Links:**
- FIFA Official: `https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/tickets`
- Ticketmaster: `https://www.ticketmaster.com/fifa-world-cup-tickets/artist/2713945`

### 4. **Navigate** (Purple)
- **Primary**: Google Maps to venue
- **Fallback**: Apple Maps (iOS), Waze
- **Features**: Include parking, public transit options

**Deep Links:**
- Google Maps: `https://www.google.com/maps/dir/?api=1&destination=SoFi+Stadium&destination_place_id=ChIJLfySpTOsEmsRsc_JfJtljdc`
- Apple Maps: `https://maps.apple.com/?daddr=SoFi+Stadium&dirflg=d`
- Waze: `https://waze.com/ul?ll=33.9533,-118.3386&navigate=yes`

### 5. **Translate** (Red)
- **Primary**: Google Translate
- **Features**: 
  - Auto-detect source language
  - Target language based on venue country
  - Text-to-speech for phrases

**Links:**
- Google Translate: `https://translate.google.com/?sl=auto&tl=es&op=translate`
- Quick phrases: Common FIFA phrases pre-translated

### 6. **My Events** (Pink)
- **Internal**: Saved matches and favorites
- **Storage**: LocalStorage + optional backend sync
- **Features**: Calendar integration, reminders

---

## Data Model

### Venue Interface
```typescript
interface Venue {
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
```

### Quick Action Interface
```typescript
interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType;
  color: string;
  handler: (context?: ActionContext) => void;
  deepLinks: DeepLink[];
}

interface DeepLink {
  platform: 'ios' | 'android' | 'web';
  app?: string; // 'uber', 'lyft', 'yelp', etc.
  url: string;
  fallbackUrl?: string;
}
```

---

## Implementation Steps

### Phase 1: Core Components (30 min)
1. Create `QuickActions.tsx` with grid layout
2. Create `QuickActionCard.tsx` with icons and colors
3. Add CSS with hover effects and responsiveness

### Phase 2: Services (30 min)
1. `deepLinkService.ts`:
   - `generateUberLink(venue)`
   - `generateYelpLink(venue)`
   - `generateMapsLink(venue)`
   - `generateTranslateLink(sourceLang, targetLang)`
   - Platform detection helper

2. `venueService.ts`:
   - FIFA 2026 venue data
   - Get venue by city/name
   - Get nearest venue by geolocation

### Phase 3: Integration (20 min)
1. Add Quick Actions to ChatInterface
2. Connect to venue context
3. Handle deep link navigation
4. Add analytics/tracking

### Phase 4: Testing (20 min)
1. Test on mobile (iOS/Android)
2. Test on desktop browsers
3. Test fallback scenarios
4. Test with different venues

---

## Venue Data (FIFA 2026)

### Key Stadiums
```typescript
const FIFA_2026_VENUES = [
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    coordinates: { latitude: 33.9533, longitude: -118.3386 },
    placeId: 'ChIJLfySpTOsEmsRsc_JfJtljdc',
    primaryLanguage: 'en'
  },
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York',
    country: 'USA',
    coordinates: { latitude: 40.8135, longitude: -74.0745 },
    primaryLanguage: 'en'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    coordinates: { latitude: 19.3030, longitude: -99.1506 },
    primaryLanguage: 'es'
  }
  // ... more venues
];
```

---

## User Experience

### Desktop Flow
1. User clicks "Book Ride" → Opens Uber web in new tab
2. User clicks "Find Food" → Opens Yelp with map centered on venue
3. User clicks "Translate" → Opens Google Translate with venue's primary language

### Mobile Flow
1. User taps "Book Ride" → Prompts to open Uber app (if installed) or web
2. User taps "Navigate" → Opens native Maps app with directions
3. User taps "Get Tickets" → Opens FIFA ticketing in browser

---

## Security & Privacy

1. **No location tracking**: Use venue coordinates, not user location
2. **External links**: Warn before opening external apps
3. **No API keys exposed**: Deep links are public URLs
4. **Graceful fallbacks**: Always provide web alternative

---

## Analytics

Track engagement:
- Quick action clicks
- Which actions are most popular
- Fallback usage rate
- Venue-specific patterns

---

## Future Enhancements

1. **Smart suggestions**: Show relevant actions based on chat context
2. **Personalization**: Remember user preferences (Uber vs Lyft)
3. **Integration**: Deep link from match schedules
4. **Accessibility**: ARIA labels, keyboard navigation
5. **i18n**: Translate action titles based on user locale

---

## Technical Notes

### Deep Link Testing
- Use `window.location.href` for navigation
- Check `navigator.userAgent` for platform detection
- Implement timeout fallback (500ms) for app detection
- Use `window.open()` with `noopener,noreferrer` for security

### Performance
- Lazy load venue data (only load when Quick Actions visible)
- Memoize deep link generation
- Debounce rapid clicks

### Browser Compatibility
- Test on Chrome, Safari, Firefox, Edge
- Handle iOS Safari restrictions
- Provide desktop alternatives for mobile-only apps

---

## Success Metrics

1. **Adoption**: >30% of users click at least one Quick Action
2. **Engagement**: Average 2+ Quick Actions per session
3. **Completion**: >80% successfully open external app/service
4. **Satisfaction**: <5% fallback to web when app preferred

---

## Dependencies

- `react-icons`: For action icons
- No additional packages needed (use native deep links)

---

## Rollout Plan

1. **Week 1**: Implement core component and 3 primary actions (Ride, Food, Navigate)
2. **Week 2**: Add Tickets, Translate, My Events
3. **Week 3**: Test on devices, refine UX
4. **Week 4**: Analytics and optimization

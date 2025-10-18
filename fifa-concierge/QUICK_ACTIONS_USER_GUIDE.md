# Quick Actions - User Guide 🎯

## What Are Quick Actions?

Quick Actions are **one-tap shortcuts** to essential FIFA 2026 services. They appear on the chat screen and let you instantly access:

- 🚗 **Ride booking** (Uber/Lyft)
- 🍽️ **Restaurant search** (Yelp)
- 🎟️ **Ticket purchasing** (FIFA official)
- 🧭 **Navigation** (Google Maps)
- 🌐 **Translation** (Google Translate)
- 📅 **My saved events**

## How to Use

### 1. Book a Ride 🚗

**What it does**: Opens Uber or Lyft app with the current FIFA venue (default: SoFi Stadium) set as your destination.

**Mobile**: 
- Tries to open Uber app first
- If Uber not installed, tries Lyft
- If neither installed, opens Uber mobile web

**Desktop**: Opens Uber web in new tab

**Example**: You're at your hotel and want to go to SoFi Stadium for the match. Click "Book a Ride" → Uber opens with SoFi Stadium already entered as destination → Just confirm pickup location and book!

### 2. Find Food 🍽️

**What it does**: Opens Yelp search for restaurants near the current venue.

**Mobile**: 
- Tries to open Yelp app
- Falls back to Yelp mobile web if not installed

**Desktop**: Opens Yelp web in new tab

**Example**: You arrived early to the stadium area and want to grab dinner. Click "Find Food" → Yelp shows nearby restaurants → See ratings, photos, make reservations!

### 3. Get Tickets 🎟️

**What it does**: Opens the official FIFA World Cup 2026 ticketing website.

**All platforms**: Opens [fifa.com/tickets](https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/tickets) in new tab

**Example**: Your friend wants to join you for a match. Click "Get Tickets" → FIFA official site loads → Browse available matches → Purchase tickets!

### 4. Navigate 🧭

**What it does**: Opens Google Maps (or Apple Maps on iOS) with driving directions to the current venue.

**Mobile**:
- iOS: Tries Google Maps app → Falls back to Apple Maps → Falls back to web
- Android: Opens Google Maps app with navigation intent

**Desktop**: Opens Google Maps web with directions

**Example**: You're driving to MetLife Stadium and need GPS directions. Click "Navigate" → Google Maps opens with "Directions to MetLife Stadium" → Turn-by-turn navigation starts!

### 5. Translate 🌐

**What it does**: Opens Google Translate with common FIFA phrases.

**Smart language selection**:
- Mexico venues → Spanish
- Canada/USA venues → English
- Auto-detects and translates common phrases like:
  - "Where is the bathroom?"
  - "How much does this cost?"
  - "What time is the match?"
  - "I need help"

**All platforms**: Opens Google Translate web in new tab

**Example**: You're at Estadio Azteca in Mexico City and need to ask for directions. Click "Translate" → Google Translate opens with Spanish phrases → Show your phone to locals!

### 6. My Events 📅

**What it does**: Shows your saved matches and upcoming events.

**Currently**: Shows count of saved events from browser local storage

**Future**: Will open a dedicated page showing:
- Your saved matches with dates/times
- Venue information
- Reminder settings
- Share/export options

**Example**: Click "My Events" → See "You have 3 saved events" → (Future: Full calendar view of your FIFA schedule)

## Deep Linking Explained

### What are deep links?

Deep links are special URLs that can:
1. Open a specific app on your phone (if installed)
2. Navigate to a specific page within that app
3. Fall back to a web page if the app isn't installed

### Examples:

**Uber deep link**: 
```
uber://?action=setPickup&dropoff[latitude]=33.9533&dropoff[longitude]=-118.3386
```
This opens Uber app and sets SoFi Stadium as destination.

**Yelp deep link**:
```
yelp:///search?terms=restaurants&ll=33.9533,-118.3386
```
This opens Yelp app and searches for restaurants near SoFi Stadium.

**Google Maps deep link**:
```
comgooglemaps://?daddr=33.9533,-118.3386&directionsmode=driving
```
This opens Google Maps with driving directions to SoFi Stadium.

### Why deep links are awesome:

1. **Faster**: Skip opening browser → searching for app → entering data
2. **Better UX**: Seamlessly transition from our app to external services
3. **Context-aware**: Pre-fill destination, location, search terms
4. **Graceful fallbacks**: Always works, even without apps installed

## Venue-Aware Routing

Quick Actions automatically know which FIFA venue you're interested in:

### 11 FIFA 2026 Venues Supported:

| Venue | City | Country | ID |
|-------|------|---------|-----|
| SoFi Stadium | Los Angeles | USA | `sofi` |
| MetLife Stadium | New York/New Jersey | USA | `metlife` |
| Estadio Azteca | Mexico City | Mexico | `azteca` |
| AT&T Stadium | Dallas | USA | `att` |
| Arrowhead Stadium | Kansas City | USA | `arrowhead` |
| Mercedes-Benz Stadium | Atlanta | USA | `mercedes-benz` |
| Lumen Field | Seattle | USA | `lumen` |
| BC Place | Vancouver | Canada | `bc-place` |
| BMO Field | Toronto | Canada | `bmo` |
| Estadio BBVA | Monterrey | Mexico | `bbva` |
| Estadio Akron | Guadalajara | Mexico | `akron` |

### How it works:

1. You select a match or venue in the chat
2. Quick Actions remember your selection
3. All actions use that venue's coordinates
4. Ride → Goes to that stadium
5. Food → Finds restaurants near that stadium
6. Navigate → Directions to that stadium
7. Translate → Uses that country's primary language

**Default**: If no venue selected, defaults to SoFi Stadium (Los Angeles)

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Quick Actions | ✅ | ✅ | ✅ | ✅ |
| Deep Links (mobile) | ✅ | ✅ | ✅ | ✅ |
| Deep Links (desktop) | ⚠️ Web only | ⚠️ Web only | ⚠️ Web only | ⚠️ Web only |
| Geolocation | ✅ | ✅ | ✅ | ✅ |

**Note**: Desktop browsers can't open mobile apps, so they always open web versions. This is by design!

## Privacy & Security

### What data is shared:

- **Venue coordinates**: Sent to Uber/Lyft/Yelp/Maps for search/navigation
- **No personal data**: We never share your name, phone, email, or payment info
- **No tracking**: Quick Actions don't track your clicks (unless you opt-in to analytics)

### How data is used:

1. **Uber/Lyft**: Only receives venue coordinates as destination
2. **Yelp**: Only receives venue coordinates for nearby search
3. **Google Maps**: Only receives venue coordinates for directions
4. **Google Translate**: Only receives pre-defined phrases (no personal data)
5. **FIFA**: No data sent, just opens their public ticketing page

### You control:

- **Location permission**: Required only if you want auto-detect nearest venue
- **App installations**: You choose which apps to install
- **Data storage**: Saved events stored locally in your browser (not on servers)

## Troubleshooting

### "Nothing happens when I click"

**Mobile**: 
- Make sure you're not blocking popups
- Check if app is installed (Uber, Lyft, Yelp, etc.)
- Try again - first tap initiates deep link, second tap opens fallback

**Desktop**:
- Check popup blocker settings
- Enable "Open links in new tab"

### "Wrong location shown"

- The default venue is SoFi Stadium
- Select a specific match or venue in chat to change it
- Check if browser location permission is enabled

### "App opens but no destination set"

- Some older app versions don't support deep links fully
- Update the app (Uber, Lyft, Yelp, etc.) to latest version
- Use the web fallback instead

### "Translate shows wrong language"

- Default is based on venue country (Mexico = Spanish, etc.)
- Manually select target language in Google Translate after it opens
- Or tell the AI assistant: "Translate to French" before clicking

## Pro Tips 💡

1. **Install the apps**: Uber, Lyft, Yelp, Google Maps for best experience
2. **Enable location**: Let browser access your location for auto-venue detection
3. **Save events**: Click "My Events" to track all your match plans
4. **Compare prices**: Use "Book Ride" to see Uber pricing, then switch to Lyft to compare
5. **Check restaurant hours**: Use "Find Food" before heading to stadium area
6. **Pre-download maps**: Use "Navigate" while on WiFi to cache offline directions
7. **Learn key phrases**: Use "Translate" before your trip to save common phrases
8. **Share with friends**: Use browser's share feature to send venue links to your group

## Future Enhancements 🚀

Coming soon to Quick Actions:

- [ ] **Weather forecast** at venue
- [ ] **Parking availability** and reservations
- [ ] **Public transit** directions (bus/metro/train)
- [ ] **Hotel booking** near venues
- [ ] **Fan zone locations** and activities
- [ ] **Live match streaming** links
- [ ] **Social media** integration (share on Twitter, Instagram)
- [ ] **Merchandise stores** near venues
- [ ] **Accessibility info** (wheelchair access, assisted listening, etc.)
- [ ] **Emergency contacts** (medical, security, lost & found)

## Feedback

Love Quick Actions? Have suggestions?

- **Report bugs**: Open an issue on GitHub
- **Request features**: Tell us what actions you want
- **Rate your experience**: Leave feedback in the chat

---

**Enjoy your FIFA World Cup 2026 experience! ⚽🏆🎉**

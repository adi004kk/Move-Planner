# MovePlanner — The Ultimate All-in-One Travel Planning Platform

> **Plan smarter. Explore more. Travel better.**

MovePlanner is a responsive, production-quality travel discovery and itinerary planning platform designed to unite destination research, day-by-day itineraries, interactive geographic maps, multi-currency budgeting, and practical safety guides.

---

## Key Features

1. **Global Destination Discovery (`/explore`, `/destinations/:slug`)**
   - 20+ comprehensive destinations (Manali, Goa, Jaipur, Udaipur, Leh-Ladakh, Rishikesh, Varanasi, Kerala, Kashmir, Andaman, Singapore, Bali, Dubai, Kyoto, Interlaken, Paris, Rome, Bangkok, Iceland, Maldives).
   - High-resolution editorial photography, seasonal guidelines, safety ratings, and local transport options.

2. **Accommodations & Stays (`/hotels`, `/hotels/:slug`)**
   - Filter by property type (Luxury Resorts, Heritage Palaces, Boutique Hotels, Hostels), amenities, and family suitability.
   - Transparent price estimates with room options and policies.

3. **Food & Local Gastronomy (`/food`, `/food/:slug`)**
   - Signature local dishes, street food highlights, cafes, and rooftop fine dining.
   - Dietary tags (Vegetarian, Vegan, Pure Veg, Halal).

4. **Sightseeing & Outdoor Activities (`/attractions`, `/activities`)**
   - Monuments, temples, museums, nature walks, and viewpoints with verified opening hours, admission costs, and accessibility notes.
   - Adventure booking highlights: tandem paragliding, scuba diving, bungee jumping, and desert safaris.

5. **Multi-Step Trip Planning Wizard (`/itinerary-planner`)**
   - 9-step interactive flow: Destination, Travel Dates, Party Dynamics, Budget Tier, Themes & Interests, Travel Pace, Local Transport, Accommodation, and Itinerary Generation.
   - Deterministic algorithm synthesizing attractions, dining, and transit distances into an editable schedule.

6. **Intelligent Day-by-Day Itinerary Builder (`/itinerary/:id`)**
   - Reorder activities with Move Up / Move Down controls.
   - Add custom activities, delete stops, and mark stops completed.
   - Clean printable layout with PDF export styling.

7. **Interactive Travel Map (`/map`)**
   - OpenStreetMap & Leaflet integration with interactive category pins (Destinations, Hotels, Restaurants, Attractions, Activities).
   - Selected place flyout cards with turn-by-turn Google Maps navigation shortcuts.

8. **Trip Budget Calculator (`/budget-planner`)**
   - Multi-currency support (INR ₹, USD $, EUR €, GBP £).
   - Target budget utilization progress bar, cost per person, and cost per day breakdown.
   - Itemized expense tracking with estimated vs actual costs and paid status toggles.

9. **Destination Comparison Matrix (`/compare`)**
   - Compare up to 3 destinations side-by-side across budget, duration, climate, culinary highlights, and safety scores.

10. **Pre-Departure Checklists & Safety (`/travel-tips`)**
    - Interactive 12-item packing checklist with interactive check-offs.
    - Common tourist scams and countermeasures.
    - Verified international emergency helpline numbers.

11. **Guest Mode & Local Persistence**
    - 100% functional without an account; bookmarks and trip states persist in `localStorage`.
    - JSON backup export and data reset capabilities in `/settings`.

---

## Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 + Plus Jakarta Sans & Playfair Display typography
- **Routing:** React Router v7
- **Mapping:** Leaflet & OpenStreetMap
- **Icons:** Lucide React

---

## Development Setup

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```

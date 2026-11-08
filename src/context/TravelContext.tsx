import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Trip, ExpenseItem, UserPreferences, Destination, Hotel, Attraction, Restaurant, Review } from '../types/travel';
import { DESTINATIONS, SAMPLE_ITINERARIES } from '../data/travelData';
import { INITIAL_REVIEWS } from '../data/travelReviews';
import { CurrencyService } from '../services/apiAdapters';
import { generateDefaultPackingList } from '../data/packingDefaults';


interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface TravelContextType {
  // Currency
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (amountInr: number) => string;

  // Saved items (Favorites)
  savedDestinationIds: string[];
  savedHotelIds: string[];
  savedRestaurantIds: string[];
  savedAttractionIds: string[];
  toggleSaveDestination: (id: string) => void;
  toggleSaveHotel: (id: string) => void;
  toggleSaveRestaurant: (id: string) => void;
  toggleSaveAttraction: (id: string) => void;
  isDestinationSaved: (id: string) => boolean;
  isHotelSaved: (id: string) => boolean;
  isRestaurantSaved: (id: string) => boolean;
  isAttractionSaved: (id: string) => boolean;

  // Trips management
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  createTrip: (newTrip: Trip) => void;
  updateTrip: (updated: Trip, toastMessage?: string | null) => void;
  deleteTrip: (tripId: string) => void;
  duplicateTrip: (tripId: string) => void;

  // Budget & Expenses
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;

  // User Profile
  user: UserPreferences;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  login: (credentials: { email: string; name?: string; homeCity?: string }) => void;
  logout: () => void;
  loginAsDemoUser: () => void;

  // Recent Searches
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Ratings & Reviews
  reviews: Review[];
  addReview: (newReview: {
    targetId: string;
    targetType: 'destination' | 'hotel' | 'attraction' | 'restaurant' | 'guide';
    author: string;
    rating: number;
    title: string;
    comment: string;
    travelerType?: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
    monthOfVisit?: string;
  }) => void;
  voteReviewHelpful: (reviewId: string) => void;
  getReviewsForTarget: (targetId: string) => Review[];
  getTargetRatingSummary: (targetId: string, fallbackRating?: number, fallbackCount?: number) => {
    averageRating: number;
    totalCount: number;
    distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  };
}


const DEFAULT_USER: UserPreferences = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  homeCity: 'New Delhi, India',
  preferredCurrency: 'INR',
  travelStyle: 'Balanced',
  preferredInterests: ['Culture', 'Adventure', 'Foodies'],
  dietaryPreferences: ['Vegetarian Friendly'],
  accessibilityNeeds: [],
  isLoggedIn: true
};

const INITIAL_TRIP: Trip = {
  id: 'trip-manali-2026',
  title: 'Himalayan Escape: Manali Mountains',
  destinationName: 'Manali',
  destinationId: 'dest-manali',
  startDate: '2026-11-10',
  endDate: '2026-11-13',
  travellers: { adults: 2, children: 0, type: 'Couple' },
  totalBudget: 35000,
  currency: 'INR',
  travelStyle: 'Balanced',
  transportPreference: 'Volvo Bus & Local Taxis',
  accommodationPreference: 'Boutique Mountain Resort',
  status: 'Planning',
  coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  itinerary: SAMPLE_ITINERARIES[0],
  createdAt: '2026-10-15',
  notes: 'Pack warm windproof thermal wear, sunglasses for snow at Atal Tunnel, and booking confirmation for Hadimba tour.',
  packingChecklist: generateDefaultPackingList({
    destinationName: 'Manali',
    category: 'Hill Station',
    durationDays: 4,
    travellersCount: 2
  })
};

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 'exp-1', category: 'Accommodation', title: 'Mountain View Resort (3 Nights)', estimatedAmount: 16500, actualAmount: 15800, paid: true },
  { id: 'exp-2', category: 'Transport', title: 'Roundtrip Volvo AC Semi-Sleeper', estimatedAmount: 4800, actualAmount: 4800, paid: true },
  { id: 'exp-3', category: 'Transport', title: 'Local 4x4 Gypsy to Atal Tunnel & Sissu', estimatedAmount: 3500, actualAmount: 3200, paid: false },
  { id: 'exp-4', category: 'Activities', title: 'Solang Valley Paragliding (2 Persons)', estimatedAmount: 6400, actualAmount: 6000, paid: false },
  { id: 'exp-5', category: 'Food', title: 'Riverside Cafes & Local Dhaam Lunches', estimatedAmount: 4500, actualAmount: 2200, paid: false },
  { id: 'exp-6', category: 'Emergency', title: 'Contingency / Medical First Aid', estimatedAmount: 2500, actualAmount: 0, paid: false }
];

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('mp_currency') as Currency) || 'INR';
  });

  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mp_saved_destinations');
    return saved ? JSON.parse(saved) : ['dest-manali', 'dest-goa', 'dest-singapore'];
  });

  const [savedHotelIds, setSavedHotelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mp_saved_hotels');
    return saved ? JSON.parse(saved) : ['hotel-manu-allaya', 'hotel-taj-lake-palace'];
  });

  const [savedRestaurantIds, setSavedRestaurantIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mp_saved_restaurants');
    return saved ? JSON.parse(saved) : ['rest-cafe-1947', 'rest-vinayak-family-goa'];
  });

  const [savedAttractionIds, setSavedAttractionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mp_saved_attractions');
    return saved ? JSON.parse(saved) : ['attr-hadimba', 'attr-fontainhas', 'attr-fushimi-inari'];
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('mp_trips');
    return saved ? JSON.parse(saved) : [INITIAL_TRIP];
  });

  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0] || null);

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('mp_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [user, setUser] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('mp_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('mp_searches');
    return saved ? JSON.parse(saved) : ['Manali', 'Goa beaches', 'Singapore with family', 'Udaipur lakes'];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mp_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);


  // Local storage persistence effects
  useEffect(() => {
    localStorage.setItem('mp_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('mp_saved_destinations', JSON.stringify(savedDestinationIds));
  }, [savedDestinationIds]);

  useEffect(() => {
    localStorage.setItem('mp_saved_hotels', JSON.stringify(savedHotelIds));
  }, [savedHotelIds]);

  useEffect(() => {
    localStorage.setItem('mp_saved_restaurants', JSON.stringify(savedRestaurantIds));
  }, [savedRestaurantIds]);

  useEffect(() => {
    localStorage.setItem('mp_saved_attractions', JSON.stringify(savedAttractionIds));
  }, [savedAttractionIds]);

  useEffect(() => {
    localStorage.setItem('mp_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('mp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('mp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mp_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('mp_reviews', JSON.stringify(reviews));
  }, [reviews]);


  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    showToast(`Currency changed to ${curr}`);
  };

  const formatPrice = (amountInr: number) => {
    return CurrencyService.format(amountInr, currency);
  };

  // Toggle helpers
  const toggleSaveDestination = (id: string) => {
    setSavedDestinationIds(prev => {
      const exists = prev.includes(id);
      showToast(exists ? 'Removed destination from saved' : 'Destination saved to your collection!');
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const toggleSaveHotel = (id: string) => {
    setSavedHotelIds(prev => {
      const exists = prev.includes(id);
      showToast(exists ? 'Hotel removed from saved' : 'Hotel bookmarked!');
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const toggleSaveRestaurant = (id: string) => {
    setSavedRestaurantIds(prev => {
      const exists = prev.includes(id);
      showToast(exists ? 'Restaurant removed' : 'Food spot saved!');
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const toggleSaveAttraction = (id: string) => {
    setSavedAttractionIds(prev => {
      const exists = prev.includes(id);
      showToast(exists ? 'Attraction removed' : 'Attraction saved to favorites!');
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const isDestinationSaved = (id: string) => savedDestinationIds.includes(id);
  const isHotelSaved = (id: string) => savedHotelIds.includes(id);
  const isRestaurantSaved = (id: string) => savedRestaurantIds.includes(id);
  const isAttractionSaved = (id: string) => savedAttractionIds.includes(id);

  // Trips CRUD
  const createTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    showToast(`Trip to ${newTrip.destinationName} created successfully!`);
  };

  const updateTrip = (updated: Trip, toastMessage?: string | null) => {
    setTrips(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    if (activeTrip?.id === updated.id) {
      setActiveTrip(updated);
    }
    if (toastMessage !== null && toastMessage !== undefined) {
      showToast(toastMessage);
    } else if (toastMessage === undefined) {
      showToast('Trip itinerary updated.');
    }
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (activeTrip?.id === tripId) {
      setActiveTrip(trips.find(t => t.id !== tripId) || null);
    }
    showToast('Trip deleted.', 'info');
  };

  const duplicateTrip = (tripId: string) => {
    const source = trips.find(t => t.id === tripId);
    if (!source) return;
    const duplicated: Trip = {
      ...source,
      id: `trip-${Date.now()}`,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTrips(prev => [duplicated, ...prev]);
    showToast('Trip duplicated successfully.');
  };

  // Expenses CRUD
  const addExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = { ...item, id: `exp-${Date.now()}` };
    setExpenses(prev => [newItem, ...prev]);
    showToast('Expense logged in budget!');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Expense updated.');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed.', 'info');
  };

  // User
  const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
    setUser(prev => ({ ...prev, ...prefs }));
    showToast('Preferences saved.');
  };

  const login = (credentials: { email: string; name?: string; homeCity?: string }) => {
    const rawName = credentials.name?.trim() || credentials.email.split('@')[0] || 'Traveler';
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const newUser: UserPreferences = {
      name: formattedName,
      email: credentials.email.trim(),
      homeCity: credentials.homeCity?.trim() || 'New Delhi, India',
      preferredCurrency: user.preferredCurrency || 'INR',
      travelStyle: user.travelStyle || 'Balanced',
      preferredInterests: user.preferredInterests?.length ? user.preferredInterests : ['Culture', 'Adventure', 'Foodies'],
      dietaryPreferences: user.dietaryPreferences || [],
      accessibilityNeeds: user.accessibilityNeeds || [],
      isLoggedIn: true
    };
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const logout = () => {
    setUser({
      name: 'Guest Traveler',
      email: '',
      homeCity: '',
      preferredCurrency: currency,
      travelStyle: 'Balanced',
      preferredInterests: [],
      dietaryPreferences: [],
      accessibilityNeeds: [],
      isLoggedIn: false
    });
    showToast('You have been logged out (Guest Mode)', 'info');
  };

  const loginAsDemoUser = () => {
    setUser(DEFAULT_USER);
    showToast(`Welcome back, ${DEFAULT_USER.name}!`);
  };

  // Searches
  const addRecentSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches(prev => [clean, ...prev.filter(q => q.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };


  // Reviews & Ratings methods
  const addReview = (newReview: {
    targetId: string;
    targetType: 'destination' | 'hotel' | 'attraction' | 'restaurant' | 'guide';
    author: string;
    rating: number;
    title: string;
    comment: string;
    travelerType?: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
    monthOfVisit?: string;
  }) => {
    const createdReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...newReview,
      avatar: user.isLoggedIn
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : undefined,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      userVotedHelpful: false
    };

    setReviews(prev => [createdReview, ...prev]);
    showToast('Your rating and review has been submitted successfully!', 'success');
  };

  const voteReviewHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          const currentlyVoted = !!r.userVotedHelpful;
          const currentCount = r.helpfulCount || 0;
          return {
            ...r,
            userVotedHelpful: !currentlyVoted,
            helpfulCount: currentlyVoted ? Math.max(0, currentCount - 1) : currentCount + 1
          };
        }
        return r;
      })
    );
  };

  const getReviewsForTarget = (targetId: string) => {
    return reviews.filter(r => r.targetId === targetId);
  };

  const getTargetRatingSummary = (targetId: string, fallbackRating: number = 4.8, fallbackCount: number = 100) => {
    const targetReviews = reviews.filter(r => r.targetId === targetId);
    if (targetReviews.length === 0) {
      return {
        averageRating: fallbackRating,
        totalCount: fallbackCount,
        distribution: {
          5: Math.round(fallbackCount * 0.72),
          4: Math.round(fallbackCount * 0.20),
          3: Math.round(fallbackCount * 0.05),
          2: Math.round(fallbackCount * 0.02),
          1: Math.round(fallbackCount * 0.01)
        }
      };
    }

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    targetReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      dist[star] = (dist[star] || 0) + 1;
      sum += r.rating;
    });

    const averageRating = Number((sum / targetReviews.length).toFixed(1));

    return {
      averageRating,
      totalCount: targetReviews.length,
      distribution: dist as { 5: number; 4: number; 3: number; 2: number; 1: number }
    };
  };

  return (
    <TravelContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        savedDestinationIds,
        savedHotelIds,
        savedRestaurantIds,
        savedAttractionIds,
        toggleSaveDestination,
        toggleSaveHotel,
        toggleSaveRestaurant,
        toggleSaveAttraction,
        isDestinationSaved,
        isHotelSaved,
        isRestaurantSaved,
        isAttractionSaved,
        trips,
        activeTrip,
        setActiveTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        user,
        updateUserPreferences,
        login,
        logout,
        loginAsDemoUser,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        toasts,
        showToast,
        reviews,
        addReview,
        voteReviewHelpful,
        getReviewsForTarget,
        getTargetRatingSummary
      }}

    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center justify-between gap-3 ${
              toast.type === 'warning'
                ? 'bg-amber-600 text-white'
                : toast.type === 'info'
                ? 'bg-slate-800 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};

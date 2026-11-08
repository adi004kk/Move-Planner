/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { SearchPage } from './pages/SearchPage';
import { HotelsPage } from './pages/HotelsPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { FoodPage } from './pages/FoodPage';
import { FoodDetailPage } from './pages/FoodDetailPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { TransportPage } from './pages/TransportPage';
import { BestTimeToVisitPage } from './pages/BestTimeToVisitPage';
import { TravelGuidesPage } from './pages/TravelGuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { ItineraryPlannerPage } from './pages/ItineraryPlannerPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { MapPage } from './pages/MapPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { SavedPage } from './pages/SavedPage';
import { ComparePage } from './pages/ComparePage';
import { TravelTipsPage } from './pages/TravelTipsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';

// Scroll to top helper on route transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <ScrollToTop />
      
      {/* Top Header */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 gap-6 sm:gap-8">
        
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Route Workspace */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:slug" element={<HotelDetailPage />} />
            
            <Route path="/food" element={<FoodPage />} />
            <Route path="/food/:slug" element={<FoodDetailPage />} />
            
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/attractions/:slug" element={<AttractionDetailPage />} />
            
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/best-time-to-visit" element={<BestTimeToVisitPage />} />
            
            <Route path="/travel-guides" element={<TravelGuidesPage />} />
            <Route path="/travel-guides/:slug" element={<GuideDetailPage />} />
            
            <Route path="/itinerary-planner" element={<ItineraryPlannerPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/itinerary/:id" element={<ItineraryBuilderPage />} />
            
            <Route path="/map" element={<MapPage />} />
            <Route path="/budget-planner" element={<BudgetPlannerPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/travel-tips" element={<TravelTipsPage />} />
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Bottom Navigation for Mobile Screens */}
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </TravelProvider>
  );
}

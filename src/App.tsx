/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getBakeryConfig, BakeryConfig } from './config/bakeryConfig';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { getCakes, getCakeById } from './services/productService';
import { Cake } from './types/cake';
import { BakeryOrder } from './types/order';

// Layout & Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { CartDrawer } from './components/cart/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CakeDetailPage } from './pages/CakeDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CustomCakePage } from './pages/CustomCakePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LegalPage } from './pages/LegalPages';

export default function App() {
  const [config, setConfig] = useState<BakeryConfig>(() => getBakeryConfig());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCakeId, setSelectedCakeId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Cakes');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<BakeryOrder | null>(null);
  const [trackTargetOrderId, setTrackTargetOrderId] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('sweetcrumbs_admin_auth') === 'true';
  });

  const [cakes, setCakes] = useState<Cake[]>(() => getCakes());

  // Listen to popstate or navigation
  const navigate = (page: string, params?: Record<string, string>) => {
    if (params?.cakeId) {
      setSelectedCakeId(params.cakeId);
    }
    if (params?.category) {
      setSelectedCategory(params.category);
    }
    if (params?.orderId) {
      setTrackTargetOrderId(params.orderId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCake = (cake: Cake) => {
    setSelectedCakeId(cake.id);
    setCurrentPage('cake-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: BakeryOrder) => {
    setLastPlacedOrder(order);
    setCurrentPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('sweetcrumbs_admin_auth', 'true');
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('sweetcrumbs_admin_auth');
    setCurrentPage('home');
  };

  const handleUpdateConfig = (newConfig: BakeryConfig) => {
    setConfig(newConfig);
  };

  // Find currently active cake for detail page
  const currentCake = selectedCakeId ? getCakeById(selectedCakeId) || cakes[0] : cakes[0];

  const featuredCakes = cakes.filter((c) => c.isFeatured || c.isBestSeller);

  const isAdminPage = currentPage === 'admin';

  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2422] selection:bg-[#881337] selection:text-white">
          {/* Header Navigation */}
          <Navbar
            config={config}
            currentPage={currentPage}
            onNavigate={navigate}
            isAdminLoggedIn={isAdminLoggedIn}
          />

          {/* Slide-out Cart Drawer */}
          <CartDrawer
            onProceedToCheckout={() => navigate('checkout')}
            onNavigateToMenu={() => navigate('menu')}
          />

          {/* Main Body Router */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                config={config}
                featuredCakes={featuredCakes}
                onNavigate={navigate}
                onSelectCake={handleSelectCake}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  navigate('menu');
                }}
              />
            )}

            {currentPage === 'menu' && (
              <MenuPage
                cakes={cakes}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectCake={handleSelectCake}
              />
            )}

            {currentPage === 'cake-detail' && currentCake && (
              <CakeDetailPage
                cake={currentCake}
                config={config}
                onBack={() => navigate('menu')}
                onNavigateToCheckout={() => navigate('checkout')}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                onNavigateToMenu={() => navigate('menu')}
                onProceedToCheckout={() => navigate('checkout')}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                config={config}
                onBackToCart={() => navigate('cart')}
                onOrderSuccess={handleOrderSuccess}
              />
            )}

            {currentPage === 'order-success' && lastPlacedOrder && (
              <OrderSuccessPage
                order={lastPlacedOrder}
                config={config}
                onNavigateToHome={() => navigate('home')}
                onNavigateToTrack={(id) => {
                  setTrackTargetOrderId(id);
                  navigate('track-order');
                }}
              />
            )}

            {currentPage === 'track-order' && (
              <TrackOrderPage
                config={config}
                initialOrderId={trackTargetOrderId}
              />
            )}

            {currentPage === 'custom-cake' && (
              <CustomCakePage
                config={config}
                onNavigateToMenu={() => navigate('menu')}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                config={config}
                onNavigateToMenu={() => navigate('menu')}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage config={config} />
            )}

            {currentPage === 'admin' && (
              isAdminLoggedIn ? (
                <AdminDashboardPage
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onLogout={handleAdminLogout}
                  onViewStorefront={() => navigate('home')}
                />
              ) : (
                <AdminLoginPage
                  config={config}
                  onLoginSuccess={handleAdminLogin}
                  onBackToHome={() => navigate('home')}
                />
              )
            )}

            {currentPage === 'privacy' && (
              <LegalPage config={config} type="privacy" />
            )}

            {currentPage === 'terms' && (
              <LegalPage config={config} type="terms" />
            )}
          </main>

          {/* Footer (hidden on admin dashboard to provide a clean management workspace) */}
          {!isAdminPage && (
            <Footer config={config} onNavigate={navigate} />
          )}

          {/* Floating WhatsApp Action Button */}
          {!isAdminPage && (
            <FloatingWhatsApp config={config} />
          )}

          {/* Mobile Bottom Navigation Bar */}
          {!isAdminPage && (
            <MobileBottomNav currentPage={currentPage} onNavigate={navigate} />
          )}
        </div>
      </CartProvider>
    </ToastProvider>
  );
}

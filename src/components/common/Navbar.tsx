import React, { useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, X, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BakeryConfig } from '../../config/bakeryConfig';

interface NavbarProps {
  config: BakeryConfig;
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  isAdminLoggedIn?: boolean;
}

export function Navbar({ config, currentPage, onNavigate, isAdminLoggedIn }: NavbarProps) {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Cake Menu', page: 'menu' },
    { label: 'Cake Designer', page: 'cake-designer' },
    { label: 'Custom Cakes', page: 'custom-cake' },
    { label: 'Track Order', page: 'track-order' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCE] transition-all">
      {/* Announcement Ribbon */}
      <div className="bg-[#2A1E17] text-[#FAF7F2] text-xs py-1.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline text-stone-300">
            Freshly Baked Every Morning in {config.city} · Same-Day Delivery Available
          </span>
          <span className="sm:hidden mx-auto text-stone-200">
            {config.city}'s Premier Artisanal Bakery
          </span>
          <div className="hidden sm:flex items-center gap-4 text-xs text-amber-200/90 font-medium">
            <span>Call: {config.phone}</span>
            <span>·</span>
            <span>Open: {config.openingTime} - {config.closingTime}</span>
          </div>
        </div>
      </div>

      {/* Primary Top Bar (Contract: Brand — 4-6 Links — 1-2 Actions) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#2A1E17] tracking-tight group-hover:text-[#881337] transition-colors">
            {config.businessName}
          </span>
        </button>

        {/* Zone 2: Clean text nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`transition-colors relative py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-[#881337] font-semibold'
                    : 'hover:text-[#2A1E17] text-stone-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#881337] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Design Cake, Search, Cart & Admin) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Direct "Design Cake" Button */}
          <button
            onClick={() => handleNavClick('cake-designer')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#881337] hover:bg-[#6e0f2c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Design Your Own Cake"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Design Cake</span>
          </button>

          {/* Quick Menu / Search */}
          <button
            onClick={() => handleNavClick('menu')}
            className="p-2 text-stone-600 hover:text-[#2A1E17] rounded-lg transition-colors cursor-pointer"
            aria-label="Browse cakes"
            title="Browse all cakes"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon & Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-700 hover:text-[#881337] transition-colors cursor-pointer focus:outline-none"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#881337] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Admin link button */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isAdminLoggedIn
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-[#EADBCE] text-stone-600 hover:text-[#2A1E17] hover:bg-[#F3EDE2]'
            }`}
            title="Bakery Management Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-[#2A1E17] rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADBCE] px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-[#EADBCE]/50 text-[#881337] font-semibold'
                  : 'text-stone-700 hover:bg-[#F3EDE2]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#EADBCE] flex items-center justify-between text-xs text-stone-600 px-3">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 text-stone-600 font-medium py-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#881337]" />
              <span>Admin Dashboard</span>
            </button>
            <span>{config.city}</span>
          </div>
        </div>
      )}
    </header>
  );
}

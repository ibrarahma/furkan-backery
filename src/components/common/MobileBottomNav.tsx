import React from 'react';
import { Home, UtensilsCrossed, Sparkles, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const { itemCount, setIsCartOpen } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Cakes', icon: UtensilsCrossed },
    { id: 'custom-cake', label: 'Custom', icon: Sparkles },
    { id: 'track-order', label: 'Track', icon: Truck },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EADBCE] h-14 flex items-center justify-around px-2"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer ${
              isActive ? 'text-[#881337]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Cart button with counter badge */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-stone-500 hover:text-[#881337] transition-colors relative cursor-pointer"
        aria-label={`Open shopping cart with ${itemCount} items`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.8px]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#881337] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-normal">Cart</span>
      </button>
    </nav>
  );
}

import React from 'react';
import { Star, ShoppingBag, Eye, Clock } from 'lucide-react';
import { Cake } from '../../types/cake';
import { CakeIllustration } from '../common/CakeIllustration';
import { DietaryBadge, ProductTag } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getBakeryConfig } from '../../config/bakeryConfig';

interface CakeCardProps {
  cake: Cake;
  onSelect: (cake: Cake) => void;
}

export function CakeCard({ cake, onSelect }: CakeCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const config = getBakeryConfig();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Default quick add: 0.5 kg, default eggless setting, first available flavour
    const defaultItem = {
      id: `${cake.id}-0.5kg-${Date.now()}`,
      cakeId: cake.id,
      cakeName: cake.name,
      category: cake.category,
      imageUrl: cake.imageUrl,
      themeColor: cake.themeColor,
      size: '0.5 kg',
      flavour: cake.availableFlavours[0] || 'Original',
      isEggless: cake.isEgglessByDefault,
      cakeMessage: '',
      specialInstructions: '',
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: '11:00 AM - 02:00 PM',
      unitPrice: cake.basePrice,
      quantity: 1,
    };

    addToCart(defaultItem);
    showToast(`Added ${cake.name} to cart!`, '0.5 kg · Ready to customize at checkout', 'success');
  };

  return (
    <div
      onClick={() => onSelect(cake)}
      className="group bg-white rounded-2xl border border-[#EADBCE] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-[#D0C0B0] hover:-translate-y-1 cursor-pointer"
    >
      {/* Visual Slot */}
      <div className="relative overflow-hidden bg-[#FAF7F2]">
        <CakeIllustration
          name={cake.name}
          category={cake.category}
          themeColor={cake.themeColor}
          imageUrl={cake.imageUrl}
          aspectRatio="4/3"
        />

        {/* Quick Tag top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
          {cake.isBestSeller && <ProductTag label="Bestseller" variant="bestseller" />}
          {cake.isNew && <ProductTag label="New" variant="new" />}
        </div>

        {/* Prep Time pill badge replacement: unboxed subtle indicator */}
        <div className="absolute bottom-3 left-3 z-20 bg-[#2A1E17]/85 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3 h-3 text-amber-300" />
          <span>{cake.prepTimeHours}h Fresh Bake</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata row: Category · Dietary */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-stone-600">
              {cake.category}
            </span>
            <DietaryBadge isEggless={cake.isEgglessByDefault} size="sm" />
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold text-[#2A1E17] line-clamp-1 group-hover:text-[#881337] transition-colors">
            {cake.name}
          </h3>

          {/* Short Tagline / Description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {cake.tagline}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-2.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-stone-800">{cake.rating}</span>
            <span>·</span>
            <span>({cake.reviewCount} orders)</span>
          </div>
        </div>

        {/* Footer Row: Price + Actions */}
        <div className="pt-4 mt-3 border-t border-[#F0E6DC] flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-500 block">Starting from</span>
            <span className="font-semibold text-base text-[#2A1E17] font-mono tabular-nums">
              {config.currency}{cake.basePrice}
            </span>
            <span className="text-[11px] text-stone-500"> / 0.5 kg</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(cake);
              }}
              className="p-2 text-stone-600 hover:text-[#2A1E17] hover:bg-[#FAF7F2] rounded-lg transition-colors border border-transparent hover:border-[#EADBCE]"
              title="View full cake customization details"
              aria-label={`View details of ${cake.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="px-3 py-1.5 bg-[#2A1E17] hover:bg-[#881337] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm focus:outline-none"
              aria-label={`Quick add ${cake.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

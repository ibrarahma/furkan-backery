import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  Calendar,
  Check,
  Sparkles,
  Info,
  Truck
} from 'lucide-react';
import { Cake, DEFAULT_CAKE_SIZES } from '../types/cake';
import { CakeIllustration } from '../components/common/CakeIllustration';
import { DietaryBadge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { BakeryConfig } from '../config/bakeryConfig';

interface CakeDetailPageProps {
  cake: Cake;
  config: BakeryConfig;
  onBack: () => void;
  onNavigateToCheckout: () => void;
}

export function CakeDetailPage({
  cake,
  config,
  onBack,
  onNavigateToCheckout
}: CakeDetailPageProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  // Customization state
  const [selectedSize, setSelectedSize] = useState('0.5 kg');
  const [selectedFlavour, setSelectedFlavour] = useState(
    cake.availableFlavours[0] || 'Signature Flavour'
  );
  const [isEggless, setIsEggless] = useState(cake.isEgglessByDefault);
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Tomorrow's date as default delivery date
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('05:00 PM - 09:00 PM');

  // Calculate dynamic price based on size multiplier
  const currentSizeObj =
    DEFAULT_CAKE_SIZES.find((s) => s.weight === selectedSize) || DEFAULT_CAKE_SIZES[0];

  const calculatedUnitPrice = Math.round(cake.basePrice * currentSizeObj.priceMultiplier);
  const totalCustomPrice = calculatedUnitPrice * quantity;

  // Time slots
  const timeSlots = [
    '10:00 AM - 01:00 PM (Morning)',
    '01:00 PM - 05:00 PM (Afternoon)',
    '05:00 PM - 09:00 PM (Evening)',
    '11:00 PM - 12:00 AM (Midnight Surprise)'
  ];

  // Validation
  const isDateInPast = deliveryDate < todayStr;
  const isSameDay = deliveryDate === todayStr;

  const handleAddToCart = () => {
    if (isDateInPast) {
      showToast('Invalid Date', 'Delivery date cannot be in the past.', 'error');
      return;
    }

    const item = {
      id: `${cake.id}-${selectedSize}-${selectedFlavour}-${isEggless ? 'eggless' : 'egg'}-${Date.now()}`,
      cakeId: cake.id,
      cakeName: cake.name,
      category: cake.category,
      imageUrl: cake.imageUrl,
      themeColor: cake.themeColor,
      size: selectedSize,
      flavour: selectedFlavour,
      isEggless,
      cakeMessage: cakeMessage.trim(),
      specialInstructions: specialInstructions.trim(),
      deliveryDate,
      deliveryTimeSlot,
      unitPrice: calculatedUnitPrice,
      quantity
    };

    addToCart(item);
    showToast(`Added ${cake.name} to cart!`, `${selectedSize} · ₹${totalCustomPrice}`, 'success');
    setIsCartOpen(true);
  };

  // Direct WhatsApp Order Generator
  const handleDirectWhatsAppOrder = () => {
    if (isDateInPast) {
      showToast('Invalid Date', 'Delivery date cannot be in the past.', 'error');
      return;
    }

    const lines = [
      `*DIRECT CAKE ORDER INQUIRY*`,
      `🎂 *${config.businessName}*`,
      '',
      `*Cake:* ${cake.name}`,
      `*Size:* ${selectedSize} (${currentSizeObj.servings})`,
      `*Flavour:* ${selectedFlavour}`,
      `*Dietary:* ${isEggless ? '100% Eggless' : 'With Egg'}`,
      `*Quantity:* ${quantity}`,
      cakeMessage.trim() ? `*Message on Cake:* "${cakeMessage.trim()}"` : '',
      `*Estimated Price:* ${config.currency}${totalCustomPrice}`,
      '',
      `*Delivery Date:* ${deliveryDate}`,
      `*Delivery Slot:* ${deliveryTimeSlot}`,
      specialInstructions.trim() ? `*Special Notes:* ${specialInstructions.trim()}` : '',
      '',
      `Hi, I would like to place an immediate order for this cake for delivery in ${config.city}!`
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#881337] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cake Menu</span>
      </button>

      {/* Product Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Showcase (Sticky on desktop) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-[#EADBCE] shadow-lg bg-[#FAF7F2]">
            <CakeIllustration
              name={cake.name}
              category={cake.category}
              themeColor={cake.themeColor}
              imageUrl={cake.imageUrl}
              aspectRatio="4/3"
            />
          </div>

          {/* Bakery Guarantee Strip */}
          <div className="bg-white rounded-2xl p-4 border border-[#EADBCE] grid grid-cols-3 gap-2 text-center text-xs text-stone-600">
            <div className="space-y-1">
              <Clock className="w-4 h-4 text-[#881337] mx-auto" />
              <p className="font-semibold text-stone-800">{cake.prepTimeHours}h Prep Time</p>
              <p className="text-[10px] text-stone-400">Baked fresh to order</p>
            </div>
            <div className="space-y-1 border-x border-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto" />
              <p className="font-semibold text-stone-800">FSSAI Certified</p>
              <p className="text-[10px] text-stone-400">100% Food hygiene</p>
            </div>
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-amber-700 mx-auto" />
              <p className="font-semibold text-stone-800">Chilled Transit</p>
              <p className="text-[10px] text-stone-400">Intact delivery safe</p>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Purchase Configurator */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-stone-600">
                {cake.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-bold text-stone-800">{cake.rating}</span>
                <span className="text-stone-400">({cake.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17]">
              {cake.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              {cake.description}
            </p>

            {/* Dynamic Price Display */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total for {selectedSize}:</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-[#881337]">
                  {config.currency}{calculatedUnitPrice}
                </span>
                <span className="text-xs text-stone-500 ml-1.5">
                  ({currentSizeObj.servings})
                </span>
              </div>
              <DietaryBadge isEggless={isEggless} size="md" />
            </div>
          </div>

          {/* 1. Size Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              1. Choose Cake Size / Weight:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_CAKE_SIZES.map((size) => {
                const isSelected = selectedSize === size.weight;
                const sizePrice = Math.round(cake.basePrice * size.priceMultiplier);
                return (
                  <button
                    key={size.weight}
                    type="button"
                    onClick={() => setSelectedSize(size.weight)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#881337] bg-white ring-2 ring-[#881337]/20 shadow-xs'
                        : 'border-[#EADBCE] bg-[#FAF7F2] hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2A1E17]">{size.weight}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5">{size.servings}</p>
                    <p className="text-xs font-semibold text-stone-900 font-mono tabular-nums mt-1">
                      {config.currency}{sizePrice}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Flavour Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              2. Select Flavour Profile:
            </label>
            <div className="flex flex-wrap gap-2">
              {cake.availableFlavours.map((flavour) => {
                const isSelected = selectedFlavour === flavour;
                return (
                  <button
                    key={flavour}
                    type="button"
                    onClick={() => setSelectedFlavour(flavour)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                        : 'bg-white text-stone-700 border-[#EADBCE] hover:border-stone-400'
                    }`}
                  >
                    {flavour}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Dietary: Egg vs Eggless Switch */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              3. Dietary Preference:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsEggless(true)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  isEggless
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-[#EADBCE] bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold">100% Eggless (Vegetarian)</span>
                </div>
                {isEggless && <Check className="w-4 h-4 text-emerald-700" />}
              </button>

              <button
                type="button"
                onClick={() => setIsEggless(false)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  !isEggless
                    ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700'
                    : 'border-[#EADBCE] bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                  <span className="text-xs font-bold">Regular (Contains Egg)</span>
                </div>
                {!isEggless && <Check className="w-4 h-4 text-amber-800" />}
              </button>
            </div>
          </div>

          {/* 4. Message on Cake */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="cake-msg-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                4. Message on Cake (Optional):
              </label>
              <span className="text-[11px] text-stone-400">Max 35 characters</span>
            </div>
            <input
              id="cake-msg-input"
              type="text"
              maxLength={35}
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="e.g., Happy 25th Birthday Rhea!"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
            />
            {cakeMessage.trim() && (
              <p className="text-[11px] text-[#881337] italic">
                Piping preview: "{cakeMessage.trim()}"
              </p>
            )}
          </div>

          {/* 5. Delivery Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="del-date-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                5. Delivery Date:
              </label>
              <input
                id="del-date-input"
                type="date"
                min={todayStr}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
              {isSameDay && (
                <p className="text-[10px] text-amber-800 font-medium">
                  ⚡ Same-Day delivery requested (order before {config.sameDayCutoffHour}:00 PM).
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="del-slot-select" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Delivery Time Slot:
              </label>
              <select
                id="del-slot-select"
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Special Instructions */}
          <div className="space-y-1.5">
            <label htmlFor="spec-inst-area" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              6. Special Notes or Delivery Instructions:
            </label>
            <textarea
              id="spec-inst-area"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less sugar, extra sparkler candle, ring doorbell twice..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
            />
          </div>

          {/* Purchase Actions Strip */}
          <div className="pt-4 border-t border-[#EADBCE] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#EADBCE] rounded-xl overflow-hidden bg-white h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 h-full text-stone-600 hover:bg-stone-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 font-mono font-bold text-sm text-stone-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 h-full text-stone-600 hover:bg-stone-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Add to Cart · {config.currency}{totalCustomPrice}
                </span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <button
              type="button"
              onClick={handleDirectWhatsAppOrder}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Directly via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

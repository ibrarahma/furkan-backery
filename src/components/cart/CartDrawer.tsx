import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { CakeIllustration } from '../common/CakeIllustration';
import { getBakeryConfig } from '../../config/bakeryConfig';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onNavigateToMenu: () => void;
}

export function CartDrawer({ onProceedToCheckout, onNavigateToMenu }: CartDrawerProps) {
  const {
    items,
    totals,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { showToast } = useToast();
  const config = getBakeryConfig();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      showToast('Coupon applied!', res.message, 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
      showToast('Coupon invalid', res.message, 'error');
    }
  };

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    if (totals.subtotal < config.minimumOrder) {
      showToast(
        'Minimum order not met',
        `A minimum cart subtotal of ₹${config.minimumOrder} is required for delivery.`,
        'error'
      );
      return;
    }
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#EADBCE]">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#EADBCE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#881337]" />
              <h2 className="font-serif text-lg font-bold text-[#2A1E17]">Your Cake Cart</h2>
              <span className="text-xs text-stone-500 font-medium">
                ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {totals.subtotal > 0 && (
            <div className="bg-[#FFF8E7] px-4 py-2.5 border-b border-[#EADBCE] text-xs">
              {totals.freeDeliveryRemaining > 0 ? (
                <div className="text-[#8D5B00]">
                  Add <strong className="font-mono tabular-nums">₹{totals.freeDeliveryRemaining}</strong> more to unlock{' '}
                  <strong className="text-emerald-800">FREE Hyderabad Delivery</strong>!
                </div>
              ) : (
                <div className="text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You've qualified for FREE Delivery in Hyderabad!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#EADBCE]/50 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2A1E17]">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Explore our freshly baked artisanal celebration cakes, cupcakes, and pastries.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToMenu();
                  }}
                  className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#881337] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Browse Cake Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 border border-[#EADBCE] shadow-xs flex gap-3 relative"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#EADBCE]">
                    <CakeIllustration
                      name={item.cakeName}
                      themeColor={item.themeColor}
                      imageUrl={item.imageUrl}
                      aspectRatio="1/1"
                      showBadge={false}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-semibold text-[#2A1E17] truncate">
                        {item.cakeName}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                      <p>
                        <span>Size: </span>
                        <strong className="text-stone-700">{item.size}</strong>
                        <span> · </span>
                        <span>{item.isEggless ? '100% Eggless' : 'With Egg'}</span>
                      </p>
                      <p className="truncate">
                        <span>Flavour: </span>
                        <span className="text-stone-700">{item.flavour}</span>
                      </p>
                      {item.cakeMessage && (
                        <p className="italic text-stone-600 line-clamp-1">
                          "{item.cakeMessage}"
                        </p>
                      )}
                    </div>

                    {/* Price and Stepper */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                      <span className="text-xs font-semibold text-[#2A1E17] font-mono tabular-nums">
                        {config.currency}{item.unitPrice * item.quantity}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#EADBCE] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-stone-600 hover:bg-[#EADBCE]/50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium font-mono tabular-nums text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-[#EADBCE]/50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EADBCE] bg-white space-y-4">
              {/* Coupon Row */}
              <div>
                {totals.appliedCouponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Coupon <strong>{totals.appliedCouponCode}</strong> applied (-₹{totals.discount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 font-semibold hover:text-emerald-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code (try WELCOME10)"
                        className="w-full text-xs px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-800">
                    {config.currency}{totals.subtotal}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-{config.currency}{totals.discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Hyderabad Delivery</span>
                  <span className="font-mono tabular-nums text-stone-800">
                    {totals.deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      `${config.currency}${totals.deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#2A1E17] pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-base">
                    {config.currency}{totals.total}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#881337] hover:bg-[#6b0f2c] text-white font-semibold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigateToMenu();
                }}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 transition-colors py-1 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

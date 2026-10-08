import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Tag, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CakeIllustration } from '../components/common/CakeIllustration';
import { getBakeryConfig } from '../config/bakeryConfig';

interface CartPageProps {
  onNavigateToMenu: () => void;
  onProceedToCheckout: () => void;
}

export function CartPage({ onNavigateToMenu, onProceedToCheckout }: CartPageProps) {
  const {
    items,
    totals,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { showToast } = useToast();
  const config = getBakeryConfig();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode.trim());
    if (res.success) {
      showToast('Coupon applied!', res.message, 'success');
      setCouponCode('');
    } else {
      setCouponError(res.message);
      showToast('Coupon invalid', res.message, 'error');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (totals.subtotal < config.minimumOrder) {
      showToast(
        'Minimum order value',
        `A minimum cart subtotal of ₹${config.minimumOrder} is required for bakery delivery.`,
        'error'
      );
      return;
    }
    onProceedToCheckout();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-white border border-[#EADBCE] flex items-center justify-center mx-auto text-stone-400 shadow-sm">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2A1E17]">Your Cart is Empty</h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            You haven't added any celebration cakes or treats yet. Browse our freshly baked menu to find your sweet craving!
          </p>
        </div>
        <button
          onClick={onNavigateToMenu}
          className="px-7 py-3.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-sm rounded-xl transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Cake Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onNavigateToMenu}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#881337] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif text-3xl font-bold text-[#2A1E17]">Shopping Cart</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-700 hover:text-rose-900 font-semibold self-start sm:self-auto cursor-pointer"
        >
          Clear entire cart
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EADBCE] shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center flex-1 min-w-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#EADBCE]">
                  <CakeIllustration
                    name={item.cakeName}
                    themeColor={item.themeColor}
                    imageUrl={item.imageUrl}
                    aspectRatio="1/1"
                    showBadge={false}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-[#2A1E17] truncate">
                    {item.cakeName}
                  </h3>
                  <div className="text-xs text-stone-500 space-y-0.5 mt-0.5">
                    <p>
                      <strong>{item.size}</strong> · {item.flavour} ·{' '}
                      <span className={item.isEggless ? 'text-emerald-700 font-medium' : 'text-stone-600'}>
                        {item.isEggless ? 'Eggless' : 'With Egg'}
                      </span>
                    </p>
                    {item.cakeMessage && (
                      <p className="italic text-stone-600 truncate">
                        Message: "{item.cakeMessage}"
                      </p>
                    )}
                    <p className="text-[11px] text-stone-400">
                      Delivery: {item.deliveryDate} ({item.deliveryTimeSlot.split(' ')[0]})
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center border border-[#EADBCE] rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2.5 py-1.5 text-stone-600 hover:bg-[#EADBCE]/50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono font-bold text-xs text-stone-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2.5 py-1.5 text-stone-600 hover:bg-[#EADBCE]/50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-base text-[#2A1E17] tabular-nums">
                    {config.currency}{item.unitPrice * item.quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17] pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Free Delivery Bar */}
            {totals.freeDeliveryRemaining > 0 ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                Add <strong>₹{totals.freeDeliveryRemaining}</strong> more for{' '}
                <strong className="text-emerald-800">FREE delivery</strong>!
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You've qualified for FREE delivery in Hyderabad!</span>
              </div>
            )}

            {/* Coupon Box */}
            <div>
              {totals.appliedCouponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{totals.appliedCouponCode}</strong> applied
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
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 text-xs px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {config.currency}{totals.subtotal}
                </span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-{config.currency}{totals.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {totals.deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `${config.currency}${totals.deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#2A1E17] pt-3 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono tabular-nums text-lg text-[#881337]">
                  {config.currency}{totals.total}
                </span>
              </div>
            </div>

            {/* Minimum order check */}
            {totals.subtotal < config.minimumOrder && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Minimum order subtotal is ₹{config.minimumOrder}. Please add ₹
                  {config.minimumOrder - totals.subtotal} more to proceed.
                </span>
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              disabled={totals.subtotal < config.minimumOrder}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                totals.subtotal < config.minimumOrder
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-[#881337] hover:bg-[#6e0f2c] text-white'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { BakeryConfig } from '../config/bakeryConfig';
import { CustomerDetails, PaymentMethod, BakeryOrder } from '../types/order';
import { createOrder, generateOrderId, getWhatsAppOrderUrl } from '../services/orderService';
import { CakeIllustration } from '../components/common/CakeIllustration';

interface CheckoutPageProps {
  config: BakeryConfig;
  onBackToCart: () => void;
  onOrderSuccess: (order: BakeryOrder) => void;
}

export function CheckoutPage({ config, onBackToCart, onOrderSuccess }: CheckoutPageProps) {
  const { items, totals, clearCart } = useCart();
  const { showToast } = useToast();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(config.city);
  const [pincode, setPincode] = useState('500034');
  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('05:00 PM - 09:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Cash on Delivery / Pay at Store'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    '10:00 AM - 01:00 PM (Morning)',
    '01:00 PM - 05:00 PM (Afternoon)',
    '05:00 PM - 09:00 PM (Evening)',
    '11:00 PM - 12:00 AM (Midnight Surprise)'
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    const actualWhatsapp = sameAsMobile ? mobileNumber : whatsappNumber;
    const cleanWa = actualWhatsapp.replace(/\D/g, '');
    if (cleanWa.length < 10) {
      errors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      errors.deliveryAddress = 'Please specify your full house/flat address and street.';
    }

    if (!pincode.trim() || pincode.trim().length < 6) {
      errors.pincode = 'Please enter a valid 6-digit postal code.';
    }

    if (!deliveryDate || deliveryDate < todayStr) {
      errors.deliveryDate = 'Delivery date cannot be in the past.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Empty Cart', 'Please add at least one cake before checkout.', 'error');
      return;
    }

    if (!validateForm()) {
      showToast('Form incomplete', 'Please fix the highlighted fields above.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const actualWhatsapp = sameAsMobile ? mobileNumber : whatsappNumber;

      const customer: CustomerDetails = {
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: actualWhatsapp.trim(),
        email: email.trim() || `${mobileNumber.trim()}@guest.sweetcrumbs.com`,
        deliveryAddress: deliveryAddress.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim()
      };

      const newOrder: BakeryOrder = {
        orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer,
        items: [...items],
        deliveryDate,
        deliveryTimeSlot,
        specialInstructions: specialInstructions.trim(),
        subtotal: totals.subtotal,
        deliveryCharge: totals.deliveryCharge,
        discount: totals.discount,
        couponCode: totals.appliedCouponCode,
        grandTotal: totals.total,
        paymentMethod,
        paymentStatus:
          paymentMethod === 'Cash on Delivery / Pay at Store' ? 'COD Pending' : 'Pending',
        status: 'Pending',
        statusHistory: [
          {
            status: 'Pending',
            timestamp: new Date().toISOString(),
            note: 'Order submitted online. Awaiting WhatsApp confirmation.'
          }
        ]
      };

      // Save order via service
      const savedOrder = await createOrder(newOrder);

      // Clear the cart
      clearCart();

      // Show toast
      showToast('Order Received!', `Order ${orderId} registered successfully.`, 'success');

      // Handover to Success view
      onOrderSuccess(savedOrder || newOrder);
    } catch (err) {
      console.error('Failed to create order', err);
      showToast('Order failed', 'Could not save order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Back button & Header */}
      <div>
        <button
          onClick={onBackToCart}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#881337] mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
        <h1 className="font-serif text-3xl font-bold text-[#2A1E17]">
          Delivery & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Provide delivery details. Your order will be confirmed immediately via WhatsApp with our bakery team.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17] flex items-center gap-2">
              <span>1. Customer & Contact Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98490 12345"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                  {formErrors.mobileNumber && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* WhatsApp Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => setSameAsMobile(e.target.checked)}
                    className="rounded text-[#881337] focus:ring-[#881337]"
                  />
                  <span>WhatsApp number is the same as mobile number</span>
                </label>

                {!sameAsMobile && (
                  <div className="mt-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 98490 12345"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                    />
                    {formErrors.whatsappNumber && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.whatsappNumber}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Delivery Address in Hyderabad */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#881337]" />
              <span>2. Delivery Address ({config.city})</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Street Address / Flat / Building <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Lotus Grandeur, Road 10, Banjara Hills"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
                {formErrors.deliveryAddress && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.deliveryAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near City Center Mall"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="500034"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                  {formErrors.pincode && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Delivery Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                  {formErrors.deliveryDate && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.deliveryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Slot <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Overall Order or Gate Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, deliver to security if unavailable"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#881337]" />
              <span>3. Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'Cash on Delivery / Pay at Store'
                    ? 'border-[#881337] bg-[#FAF7F2] ring-1 ring-[#881337]'
                    : 'border-[#EADBCE] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'Cash on Delivery / Pay at Store'}
                  onChange={() => setPaymentMethod('Cash on Delivery / Pay at Store')}
                  className="mt-0.5 text-[#881337] focus:ring-[#881337]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#2A1E17] block">
                    Cash on Delivery / Pay at Store Pickup
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block">
                    Pay in cash or via card/UPI upon doorstep arrival or counter collection.
                  </span>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'UPI / Advance Payment'
                    ? 'border-[#881337] bg-[#FAF7F2] ring-1 ring-[#881337]'
                    : 'border-[#EADBCE] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'UPI / Advance Payment'}
                  onChange={() => setPaymentMethod('UPI / Advance Payment')}
                  className="mt-0.5 text-[#881337] focus:ring-[#881337]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#2A1E17] block">
                    UPI / Advance Payment (GPay, PhonePe, Paytm, QR)
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block">
                    Direct UPI QR code and payment link will be sent in your WhatsApp confirmation.
                  </span>
                </div>
              </label>

              {/* Requirement Rule Notice */}
              <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Online payment gateway integration will be activated soon. Your order is registered securely and confirmed directly with our bakery team via WhatsApp.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Submit */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17] pb-3 border-b border-stone-100">
              Cakes in Order ({items.length})
            </h2>

            {/* List */}
            <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#EADBCE] shrink-0">
                    <CakeIllustration
                      name={item.cakeName}
                      themeColor={item.themeColor}
                      imageUrl={item.imageUrl}
                      aspectRatio="1/1"
                      showBadge={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-900 truncate">{item.cakeName}</h4>
                    <p className="text-stone-500 text-[11px]">
                      {item.size} · {item.flavour} · Qty: {item.quantity}
                    </p>
                    {item.customCakeDesign && item.customCakeDesign.decorations.length > 0 && (
                      <p className="text-[10px] text-stone-500 truncate">
                        Decorations: {item.customCakeDesign.decorations.map((d) => d.replace(/_/g, ' ')).join(', ')}
                      </p>
                    )}
                    {item.cakeMessage && (
                      <p className="text-stone-600 italic text-[11px] truncate">
                        "{item.cakeMessage}"
                      </p>
                    )}
                  </div>
                  <div className="font-mono font-bold text-stone-900 tabular-nums">
                    {config.currency}{item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {config.currency}{totals.subtotal}
                </span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({totals.appliedCouponCode})</span>
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

              <div className="flex justify-between text-base font-bold text-[#2A1E17] pt-3 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono tabular-nums text-xl text-[#881337]">
                  {config.currency}{totals.total}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Processing Order...' : 'Place Cake Order'}</span>
            </button>

            <div className="text-[11px] text-center text-stone-500 pt-1">
              🔒 Order details are protected. Confirmation opens immediately.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

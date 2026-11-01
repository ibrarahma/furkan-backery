import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Check,
  AlertCircle,
  Phone,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { BakeryOrder, OrderStatus } from '../types/order';
import { BakeryConfig } from '../config/bakeryConfig';
import { findOrderByTrackInfo } from '../services/orderService';
import { CakeIllustration } from '../components/common/CakeIllustration';

interface TrackOrderPageProps {
  config: BakeryConfig;
  initialOrderId?: string;
}

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Received', desc: 'Received online and awaiting bakery confirmation' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Verified with customer and scheduled for baking' },
  { status: 'Preparing', label: 'Preparing', desc: 'Pastry chef baking sponge and hand-piping frosting' },
  { status: 'Ready', label: 'Ready', desc: 'Decorated, boxed and resting in temperature-controlled cooler' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Dispatched with careful chilled delivery rider' },
  { status: 'Delivered', label: 'Delivered', desc: 'Safely handed over to customer' }
];

export function TrackOrderPage({ config, initialOrderId = '' }: TrackOrderPageProps) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<BakeryOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If initialOrderId is passed, auto-search
  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      findOrderByTrackInfo(initialOrderId, '').then((found) => {
        if (found) {
          setSearchedOrder(found);
          setHasSearched(true);
        }
      });
    }
  }, [initialOrderId]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderIdInput.trim()) {
      setErrorMsg('Please enter your Order ID (e.g. SCB-20261008-4821).');
      return;
    }

    try {
      const order = await findOrderByTrackInfo(orderIdInput.trim(), phoneInput.trim());
      setHasSearched(true);

      if (order) {
        setSearchedOrder(order);
        setErrorMsg('');
      } else {
        setSearchedOrder(null);
        setErrorMsg(
          'No order found matching this Order ID and phone number. Please check the spelling or contact support.'
        );
      }
    } catch {
      setSearchedOrder(null);
      setErrorMsg('Unable to check order tracking at this time. Please try again later.');
    }
  };

  const getStepStatus = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') {
      return stepStatus === 'Pending' ? 'cancelled' : 'upcoming';
    }

    const orderFlow: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered'
    ];

    const currentIdx = orderFlow.indexOf(currentStatus);
    const stepIdx = orderFlow.indexOf(stepStatus);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
          Live Kitchen Updates
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17]">
          Track Your Cake Order
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Enter your unique Order ID and phone number to check baking and delivery status in real-time.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. SCB-20261008-4821"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Find My Order</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {hasSearched && searchedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-[#2A1E17]">
                  Order {searchedOrder.orderId}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    searchedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedOrder.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {searchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Placed for: <strong>{searchedOrder.customer.fullName}</strong> ({searchedOrder.customer.city})
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-stone-500 block">Scheduled Delivery</span>
              <span className="font-bold text-stone-900">
                {searchedOrder.deliveryDate} · {searchedOrder.deliveryTimeSlot}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {searchedOrder.status === 'Cancelled' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">This order was cancelled.</p>
                <p className="text-rose-700">Please contact our bakery desk on {config.phone} for questions or refunds.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Kitchen & Delivery Timeline
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EADBCE]">
                {ORDER_STEPS.map((step) => {
                  const state = getStepStatus(step.status, searchedOrder.status);
                  const isCurrent = state === 'current';
                  const isCompleted = state === 'completed';

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#881337] border-[#881337] text-white ring-4 ring-[#881337]/20 animate-pulse'
                            : 'bg-white border-stone-300 text-stone-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : null}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-serif text-sm sm:text-base font-bold ${
                              isCurrent
                                ? 'text-[#881337]'
                                : isCompleted
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#881337]/10 text-[#881337] px-2 py-0.5 rounded-md font-semibold">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isCurrent
                              ? 'text-stone-700 font-medium'
                              : isCompleted
                              ? 'text-stone-600'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cakes in Order */}
          <div className="pt-6 border-t border-stone-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Cake Items:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCE] flex items-center gap-3 text-xs"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#EADBCE] shrink-0">
                    <CakeIllustration
                      name={item.cakeName}
                      themeColor={item.themeColor}
                      imageUrl={item.imageUrl}
                      aspectRatio="1/1"
                      showBadge={false}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-stone-900 truncate">{item.cakeName}</p>
                    <p className="text-stone-500 text-[11px]">
                      {item.size} · {item.flavour} · Qty: {item.quantity}
                    </p>
                    {item.cakeMessage && (
                      <p className="text-[#881337] italic text-[11px] truncate">
                        "{item.cakeMessage}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Strip */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-3">
            <span>Need to update delivery instructions or timing?</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${config.businessName}, I would like to inquire about my Order #${searchedOrder.orderId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Bakery</span>
              </a>
              <a
                href={`tel:${config.phone}`}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

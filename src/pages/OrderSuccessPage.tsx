import React from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  Home,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { BakeryOrder } from '../types/order';
import { BakeryConfig } from '../config/bakeryConfig';
import { getWhatsAppOrderUrl } from '../services/orderService';
import { CakeIllustration } from '../components/common/CakeIllustration';

interface OrderSuccessPageProps {
  order: BakeryOrder;
  config: BakeryConfig;
  onNavigateToHome: () => void;
  onNavigateToTrack: (orderId: string) => void;
}

export function OrderSuccessPage({
  order,
  config,
  onNavigateToHome,
  onNavigateToTrack
}: OrderSuccessPageProps) {
  const whatsappUrl = getWhatsAppOrderUrl(order, config);

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Success Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-md text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Order Received Successfully
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2A1E17]">
            Thank you for ordering from {config.businessName}!
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto pt-1">
            We have registered your cake request. Please tap the WhatsApp button below to confirm with our bakery team and schedule kitchen preparation.
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl font-mono text-sm sm:text-base font-bold text-[#881337]">
          <span>Order ID:</span>
          <span>{order.orderId}</span>
        </div>

        {/* Primary Action: Send on WhatsApp */}
        <div className="pt-4 max-w-md mx-auto space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Confirm Order on WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>
          <p className="text-[11px] text-stone-500">
            Opens WhatsApp with your complete order breakdown pre-formatted for {config.displayWhatsapp}
          </p>
        </div>
      </div>

      {/* Order Summary Receipt Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
              Order Summary
            </h2>
            <p className="text-xs text-stone-500">Customer: {order.customer.fullName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Total Paid / Payable</span>
            <span className="text-xl font-bold font-mono text-[#881337] tabular-nums">
              {config.currency}{order.grandTotal}
            </span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE] text-xs text-stone-700">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Delivery Date</p>
              <p className="text-stone-600">{order.deliveryDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Time Slot</p>
              <p className="text-stone-600">{order.deliveryTimeSlot}</p>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-[#EADBCE]/60">
            <MapPin className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Delivery Address</p>
              <p className="text-stone-600">
                {order.customer.deliveryAddress},{' '}
                {order.customer.landmark ? `${order.customer.landmark}, ` : ''}
                {order.customer.city} - {order.customer.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Cakes List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Cakes in this Order:
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-stone-300">
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
                      {item.size} · {item.flavour} · {item.isEggless ? 'Eggless' : 'With Egg'} · Qty: {item.quantity}
                    </p>
                    {item.cakeMessage && (
                      <p className="text-[#881337] italic text-[11px] truncate">
                        "{item.cakeMessage}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="font-mono font-bold text-stone-900 tabular-nums shrink-0">
                  {config.currency}{item.unitPrice * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigateToTrack(order.orderId)}
            className="flex-1 py-3 bg-[#2A1E17] hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Progress</span>
          </button>

          <button
            onClick={onNavigateToHome}
            className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { BakeryConfig } from '../config/bakeryConfig';

interface LegalProps {
  config: BakeryConfig;
  type: 'privacy' | 'terms';
}

export function LegalPage({ config, type }: LegalProps) {
  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-[#EADBCE] pb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
            Customer Privacy & Security
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2A1E17]">
            Privacy Policy - {config.businessName}
          </h1>
          <p className="text-xs text-stone-500">Last updated: October 2026</p>
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-stone-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
              1. Information We Collect
            </h2>
            <p>
              When you place an order with {config.businessName}, we collect your name, delivery address, contact mobile number, WhatsApp number, and specific cake customization requests (such as personalized messages piped on cakes).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
              2. How We Use Your Information
            </h2>
            <p>
              Your contact details are used strictly to bake your order, dispatch our delivery personnel in {config.city}, and communicate confirmation status via WhatsApp or phone. We do not sell or rent customer data to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
              3. WhatsApp Communications
            </h2>
            <p>
              By opting into our WhatsApp order confirmation flow, you agree to receive transactional updates regarding your cake preparation, delivery rider arrival, and digital invoice receipts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
              4. Contact Our Data Protection Officer
            </h2>
            <p>
              If you wish to remove your address history or have inquiries regarding your account, reach out to us at {config.email} or call {config.phone}.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-[#EADBCE] pb-6">
        <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
          Bakery Terms & Delivery Guidelines
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#2A1E17]">
          Terms & Conditions - {config.businessName}
        </h1>
        <p className="text-xs text-stone-500">Last updated: October 2026</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-stone-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
            1. Perishable Food Nature & Storage
          </h2>
          <p>
            All our celebration cakes, cupcakes, and pastries are made with real dairy and fresh ingredients. Upon delivery, please refrigerate immediately below 5°C. For optimal flavor and texture, remove from refrigerator 15–20 minutes before cutting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
            2. Same-Day Delivery & Slots
          </h2>
          <p>
            Same-day orders placed before {config.sameDayCutoffHour}:00 PM are prepared fresh in our kitchen. While we strive to meet specific delivery slots, delays caused by heavy monsoon weather or unusual traffic in Hyderabad will be communicated via phone or WhatsApp.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
            3. Cancellations & Modifications
          </h2>
          <p>
            Because customized cakes are baked to individual specifications, order cancellations must be requested at least 6 hours before scheduled dispatch. Custom tiered fondant cakes require 24 hours notice for full cancellation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2A1E17]">
            4. Food Safety & Allergen Notice
          </h2>
          <p>
            We adhere to FSSAI standards (Lic. #{config.fssaiNumber}). Our bakery handles nuts, gluten, and dairy. If you or your guests have severe allergies, please specify this clearly in the special instructions field during checkout.
          </p>
        </section>
      </div>
    </div>
  );
}

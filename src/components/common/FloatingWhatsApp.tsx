import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BakeryConfig } from '../../config/bakeryConfig';

interface FloatingWhatsAppProps {
  config: BakeryConfig;
}

export function FloatingWhatsApp({ config }: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
  const defaultText = encodeURIComponent(
    `Hello ${config.businessName}, I would like to inquire about ordering a cake in ${config.city}!`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultText}`;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Small popover prompt on first load or hover */}
      {showTooltip && (
        <div className="mb-2 bg-[#2A1E17] text-white text-xs py-2 px-3 rounded-xl shadow-lg border border-amber-900/40 flex items-center gap-2 max-w-[220px] animate-in fade-in slide-in-from-bottom-2">
          <span>Need cake advice? Chat with our head baker!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label={`Chat with ${config.businessName} on WhatsApp`}
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

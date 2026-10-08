import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, ShieldCheck } from 'lucide-react';
import { BakeryConfig } from '../../config/bakeryConfig';

interface FooterProps {
  config: BakeryConfig;
  onNavigate: (page: string) => void;
}

export function Footer({ config, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2A1E17] text-[#FAF7F2] pt-14 pb-20 md:pb-12 border-t border-[#4A3B32]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Column 1: Brand & Craft */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              {config.businessName}
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              {config.tagline}. Handcrafting celebration cakes, birthday delights, and bespoke desserts in {config.city} using pure dairy cream, Belgian chocolates, and fresh seasonal fruits.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/80 hover:bg-[#881337] flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                aria-label="Instagram profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={config.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/80 hover:bg-[#881337] flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FSSAI Lic. #{config.fssaiNumber}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors text-left"
                >
                  All Celebration Cakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom-cake')}
                  className="hover:text-white transition-colors text-left"
                >
                  Custom Tiered Designs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors text-left"
                >
                  100% Eggless Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-white transition-colors text-left"
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Our Kitchen & Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Bakery Studio
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  {config.address}, {config.landmark}, {config.city} - {config.pincode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={`tel:${config.phone}`} className="hover:text-white transition-colors">
                  {config.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                  {config.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{config.openingTime} - {config.closingTime} (Daily)</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Delivery Areas in Hyderabad */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Delivery Coverage
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Same-day & scheduled delivery across prime Hyderabad locations:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-300">
              {config.servingAreas.map((area, i) => (
                <span key={area} className="text-stone-300">
                  {area}{i < config.servingAreas.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
            <div className="pt-2 text-xs text-amber-200/90 font-medium">
              Free delivery on orders above ₹{config.freeDeliveryThreshold}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Admin */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {currentYear} {config.businessName}, {config.city}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-stone-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-stone-200 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-stone-200 transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

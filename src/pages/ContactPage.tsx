import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { BakeryConfig } from '../config/bakeryConfig';
import { useToast } from '../context/ToastContext';

interface ContactPageProps {
  config: BakeryConfig;
}

export function ContactPage({ config }: ContactPageProps) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Bulk / Corporate Order');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      showToast('Missing details', 'Please enter your name and message.', 'error');
      return;
    }

    const lines = [
      `*GENERAL BAKERY INQUIRY*`,
      `🎂 *${config.businessName}*`,
      '',
      `*Name:* ${name.trim()}`,
      phone.trim() ? `*Phone:* ${phone.trim()}` : '',
      `*Topic:* ${inquiryType}`,
      '',
      `*Message:*`,
      message.trim(),
      '',
      `Hi, I would like to get in touch regarding this inquiry.`
    ].filter(Boolean);

    const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(waUrl, '_blank');
    showToast('Inquiry drafted!', 'Opening WhatsApp chat...', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17]">
          Contact Our Bakery Team
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Have questions regarding special dietary requirements, large event catering, or same-day orders? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info & Quick Action Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#2A1E17]">
              Bakery Parlour & Kitchen
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2A1E17]">Address:</p>
                  <p className="text-stone-600">
                    {config.address}, {config.landmark}, {config.city}, {config.state} - {config.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2A1E17]">Opening Hours:</p>
                  <p className="text-stone-600">
                    Every Day: {config.openingTime} – {config.closingTime}
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                    Same-day orders accepted until {config.sameDayCutoffHour}:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2A1E17]">Phone Helpline:</p>
                  <a
                    href={`tel:${config.phone}`}
                    className="text-stone-600 hover:text-[#881337] font-semibold"
                  >
                    {config.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2A1E17]">WhatsApp Order Desk:</p>
                  <a
                    href={`https://wa.me/${config.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    {config.displayWhatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2A1E17]">Email Support:</p>
                  <a
                    href={`mailto:${config.email}`}
                    className="text-stone-600 hover:text-[#881337]"
                  >
                    {config.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${config.phone}`}
                className="flex-1 py-3 bg-[#2A1E17] hover:bg-[#881337] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>

              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form & Map Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-xs space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#2A1E17]">
              Send Us a Quick Message
            </h2>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98490 12345"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  <option value="Bulk / Corporate Order">Bulk / Corporate Celebration Order</option>
                  <option value="Wedding Tier Consultation">Wedding Tier Consultation</option>
                  <option value="Allergy / Custom Ingredients">Allergy / Custom Dietary Request</option>
                  <option value="Same-Day Rush Delivery">Same-Day Urgent Delivery Query</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our pastry chefs assist you today?"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Map & Location Area */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
                Storefront Location & Directions
              </h3>
              <span className="text-xs text-stone-500">Banjara Hills, Hyderabad</span>
            </div>

            {/* Stylized Interactive Map Container */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] p-6 text-center space-y-3 flex flex-col items-center justify-center min-h-[160px]">
              <MapPin className="w-8 h-8 text-[#881337]" />
              <div>
                <p className="font-bold text-sm text-[#2A1E17]">{config.businessName}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Plot 42, Road No. 12, Banjara Hills, Hyderabad - 500034
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Banjara+Hills+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#881337] hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

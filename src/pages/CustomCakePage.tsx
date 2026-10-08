import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Upload,
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle2,
  Heart,
  Palette,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';
import { BakeryConfig } from '../config/bakeryConfig';
import { CustomCakeInquiry } from '../types/order';
import {
  saveCustomCakeInquiry,
  generateWhatsAppCustomCakeMessage
} from '../services/orderService';
import { useToast } from '../context/ToastContext';

interface CustomCakePageProps {
  config: BakeryConfig;
  onNavigateToMenu: () => void;
}

export function CustomCakePage({ config, onNavigateToMenu }: CustomCakePageProps) {
  const { showToast } = useToast();

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [cakeType, setCakeType] = useState('Sculpted Milestone Birthday');
  const [weight, setWeight] = useState('2 kg (18-22 servings)');
  const [flavour, setFlavour] = useState('Belgian Chocolate Truffle');
  const [isEggless, setIsEggless] = useState(true);
  const [theme, setTheme] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTime, setDeliveryTime] = useState('05:00 PM - 08:00 PM');
  const [budgetRange, setBudgetRange] = useState('₹2,000 - ₹3,500');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [referenceFileName, setReferenceFileName] = useState('');

  const [submittedInquiry, setSubmittedInquiry] = useState<CustomCakeInquiry | null>(null);

  const cakeTypes = [
    'Sculpted Milestone Birthday',
    'Multi-Tiered Floral Wedding',
    'Kids 3D Character Theme',
    'Elegant Floral Fondant',
    'Custom Monogram / Number Cake',
    'Corporate Logo Centerpiece'
  ];

  const weightOptions = [
    '1.5 kg (12-16 servings)',
    '2 kg (18-22 servings)',
    '3 kg (25-30 servings)',
    '4 kg (35-40 servings)',
    '5+ kg (Grand Celebration)'
  ];

  const flavourOptions = [
    'Belgian Chocolate Truffle',
    'Red Velvet Cream Cheese',
    'Salted Caramel Hazelnut',
    'Fresh Alphonso Mango Puree',
    'Madagascar Vanilla Berry',
    'Butterscotch Cashew Crunch'
  ];

  const budgetOptions = [
    'Under ₹2,000',
    '₹2,000 - ₹3,500',
    '₹3,500 - ₹6,000',
    '₹6,000+'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceFileName(e.target.files[0].name);
      showToast('Image attached', `${e.target.files[0].name} added as reference.`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !theme.trim()) {
      showToast('Incomplete form', 'Please provide name, phone number, and cake theme.', 'error');
      return;
    }

    if (deliveryDate < todayStr) {
      showToast('Invalid Date', 'Delivery date cannot be in the past.', 'error');
      return;
    }

    const inquiryId = `CC-${Date.now().toString().slice(-6)}`;
    const inquiry: CustomCakeInquiry = {
      id: inquiryId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      cakeType,
      weight,
      flavour,
      isEggless,
      theme: theme.trim(),
      cakeMessage: cakeMessage.trim(),
      referenceImageName: referenceFileName,
      deliveryDate,
      deliveryTime,
      budgetRange,
      specialInstructions: specialInstructions.trim(),
      status: 'Inquiry Received'
    };

    saveCustomCakeInquiry(inquiry);
    setSubmittedInquiry(inquiry);
    showToast('Custom Cake Request Sent!', 'Now tap to send on WhatsApp for consultation.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-amber-700" />
          <span>Bespoke Pastry Consultation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E17]">
          Design Your Custom Cake
        </h1>
        <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
          Tell us about your theme, celebration size, and flavour cravings. Our head decorator in {config.city} will tailor a quotation and sketch for your celebration.
        </p>
      </div>

      {submittedInquiry ? (
        /* Submission Success with WhatsApp CTA */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-md text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#2A1E17]">
              Custom Cake Inquiry Received!
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Inquiry Reference <strong>#{submittedInquiry.id}</strong>. Tap below to send this directly to our bakery WhatsApp for quick pricing and photo confirmation.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] max-w-md mx-auto text-left text-xs space-y-1 text-stone-700">
            <p><strong>Customer:</strong> {submittedInquiry.customerName}</p>
            <p><strong>Theme:</strong> {submittedInquiry.theme}</p>
            <p><strong>Weight & Type:</strong> {submittedInquiry.weight} · {submittedInquiry.cakeType}</p>
            <p><strong>Dietary:</strong> {submittedInquiry.isEggless ? '100% Eggless' : 'Regular'}</p>
            <p><strong>Date:</strong> {submittedInquiry.deliveryDate} ({submittedInquiry.deliveryTime})</p>
          </div>

          <div className="max-w-md mx-auto space-y-3 pt-2">
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                generateWhatsAppCustomCakeMessage(submittedInquiry, config)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Confirm Inquiry on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSubmittedInquiry(null);
                setTheme('');
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline block mx-auto cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* The Inquiry Form */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Reddy"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp / Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
              </div>
            </div>

            {/* Cake details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cake Occasion / Type
                </label>
                <select
                  value={cakeType}
                  onChange={(e) => setCakeType(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  {cakeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estimated Weight
                </label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  {weightOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Flavour
                </label>
                <select
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  {flavourOptions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dietary Recipe
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      isEggless
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                        : 'bg-[#FAF7F2] border-[#EADBCE] text-stone-700'
                    }`}
                  >
                    🌱 100% Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      !isEggless
                        ? 'bg-amber-50 border-amber-700 text-amber-900 ring-1 ring-amber-700'
                        : 'bg-[#FAF7F2] border-[#EADBCE] text-stone-700'
                    }`}
                  >
                    🥚 With Egg
                  </button>
                </div>
              </div>
            </div>

            {/* Theme & Design Details */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                Describe Your Theme or Concept <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Space astronaut theme for a 5-year-old boy in navy blue & gold with edible planetary fondant balls..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>

            {/* Reference Image Upload Slot */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#EADBCE] text-center space-y-2">
              <Upload className="w-6 h-6 text-stone-400 mx-auto" />
              <div className="text-xs text-stone-600">
                <label
                  htmlFor="custom-cake-img"
                  className="font-bold text-[#881337] hover:underline cursor-pointer"
                >
                  Upload Pinterest / Instagram Reference Image
                </label>
                <input
                  id="custom-cake-img"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {referenceFileName ? (
                <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Attached: {referenceFileName}
                </p>
              ) : (
                <p className="text-[11px] text-stone-400">PNG, JPG or WEBP up to 10MB</p>
              )}
            </div>

            {/* Message, Date, Time, Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Time Slot
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Morning)</option>
                  <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon)</option>
                  <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM (Evening)</option>
                  <option value="11:00 PM - 12:00 AM">11:00 PM - 12:00 AM (Midnight)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Budget Target
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
                >
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Piped Cake Message (Optional)
              </label>
              <input
                type="text"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="e.g. Happy 5th Birthday Kabir!"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Instructions or Dietary Notes
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Nut allergy, less sugar, gluten-sensitive, gold acrylic topper needed..."
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#881337] hover:bg-[#6e0f2c] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Request Custom Cake Quote</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

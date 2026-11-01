import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Heart,
  Clock,
  ShieldCheck,
  Truck,
  MessageCircle,
  Phone,
  Star,
  CheckCircle2,
  Calendar,
  Utensils
} from 'lucide-react';
import { Cake, CakeCategory } from '../types/cake';
import { BakeryConfig } from '../config/bakeryConfig';
import { CakeCard } from '../components/cake/CakeCard';
import { CakeIllustration } from '../components/common/CakeIllustration';
import { SAMPLE_REVIEWS } from '../data/sampleReviews';

interface HomePageProps {
  config: BakeryConfig;
  featuredCakes: Cake[];
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onSelectCake: (cake: Cake) => void;
  onSelectCategory: (category: string) => void;
}

export function HomePage({
  config,
  featuredCakes,
  onNavigate,
  onSelectCake,
  onSelectCategory
}: HomePageProps) {
  const categoriesList: { name: CakeCategory; desc: string; color: string }[] = [
    { name: 'Birthday Cakes', desc: 'Party showstoppers & fun themes', color: '#881337' },
    { name: 'Chocolate Cakes', desc: '54% Belgian dark ganache & truffles', color: '#3E2723' },
    { name: 'Anniversary Cakes', desc: 'Elegant hearts & delicate florals', color: '#BE123C' },
    { name: 'Eggless Cakes', desc: '100% pure vegetarian cloud sponges', color: '#047857' },
    { name: 'Photo Cakes', desc: 'High-definition edible sugar memory prints', color: '#2563EB' },
    { name: 'Custom Cakes', desc: 'Handcrafted bespoke tiered centerpieces', color: '#78350F' },
    { name: 'Kids Cakes', desc: 'Unicorns, KitKat castles & superheroes', color: '#9333EA' },
    { name: 'Cupcakes', desc: 'Assorted luxury boxes of 6', color: '#EC4899' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onNavigate('menu');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-[#EADBCE]">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 rounded-full bg-rose-100/25 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Bakery Heritage Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-[#EADBCE] rounded-full text-xs font-semibold text-stone-700 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#881337]" />
                <span>Handcrafted in {config.city} · Fresh Bakes Daily</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2A1E17] leading-[1.15] tracking-tight">
                Delicious Cakes Made for Every Celebration
              </h1>

              {/* Supporting Text */}
              <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>{config.businessName}</strong>. From velvety Belgian chocolates to fruit-glazed cloud sponges, we craft unforgettable celebration cakes with doorstep delivery across {config.city}.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('cake-designer')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 to-[#881337] hover:from-amber-700 hover:to-[#6e0f2c] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer ring-2 ring-amber-300/40"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Design Your Own Cake</span>
                </button>

                <button
                  onClick={() => onNavigate('menu')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('menu')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 text-[#2A1E17] border border-[#EADBCE] font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  View Menu
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-600 border-t border-[#EADBCE]/80">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#881337]" />
                  <span>Same-Day {config.city} Delivery</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>100% Eggless Options</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{config.ratingScore}★ (1,400+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Hero Card Container */}
                <div className="relative rounded-3xl p-3 bg-white/90 border border-[#EADBCE] shadow-xl backdrop-blur-xs">
                  <div className="rounded-2xl overflow-hidden">
                    <CakeIllustration
                      name="Artisanal Tiered Celebration Cake"
                      category="Signature Creation"
                      themeColor="#881337"
                      aspectRatio="4/3"
                    />
                  </div>

                  {/* Floating Micro-Card: Chef's Promise */}
                  <div className="absolute -bottom-5 -left-4 bg-[#2A1E17] text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-900/40">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Baked Fresh Daily</p>
                      <p className="text-[10px] text-stone-300">Zero artificial stabilizers</p>
                    </div>
                  </div>

                  {/* Floating Micro-Card: Hyderabad delivery */}
                  <div className="absolute -top-4 -right-3 bg-white p-2.5 px-3.5 rounded-2xl shadow-lg border border-[#EADBCE] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-stone-800">
                      Baking now in Banjara Hills
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CAKES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
              Popular Celebration Cakes
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Our most-ordered creations for birthdays, anniversaries, and family milestones.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#881337] hover:text-[#580b22] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Cakes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCakes.slice(0, 4).map((cake) => (
            <CakeCard key={cake.id} cake={cake} onSelect={onSelectCake} />
          ))}
        </div>
      </section>

      {/* 3. CAKE CATEGORIES */}
      <section className="bg-white py-16 border-y border-[#EADBCE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
              Find the Perfect Cake for Your Moment
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Browse by celebration theme, dietary preference, or personal dessert craving.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-5 rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] hover:bg-white hover:border-[#881337] hover:shadow-md transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
              >
                <div>
                  <div
                    className="w-3.5 h-3.5 rounded-full mb-3"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h3 className="font-serif text-base font-bold text-[#2A1E17] group-hover:text-[#881337] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 group-hover:text-[#881337] pt-2">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE SWEET CRUMBS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
            The Sweet Crumbs Difference
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
            Why Hyderabad Loves Our Bakery
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Every celebration cake is baked with obsessive attention to ingredients, aesthetics, and timely delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
              Premium Artisanal Ingredients
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We exclusively use 54% dark Belgian chocolate, dairy cream, Madagascar vanilla bean pods, and farm-fresh berries. Zero artificial essences or cheap hydrogenated fats.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#881337] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
              100% Eggless Mastery
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our vegetarian sponge recipes use cultured dairy and natural binders to achieve cloud-soft tenderness that rivals any traditional cake in texture and taste.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
              Chilled Safe Transit
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Temperature-stabilized cake transport across Hyderabad with heavy-duty baseboards and dedicated delivery riders so your tiered cake arrives pristine and photo-ready.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CUSTOM CAKE HIGHLIGHT BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#2A1E17] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              Bespoke Pastry Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Have a Dream Cake in Mind? Let's Bake It Together.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Send us your theme, pinterest reference photo, favorite flavours, or milestone party concept. Our master decorators will sculpt a one-of-a-kind cake tailored exactly to your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('cake-designer')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-[#881337] hover:from-amber-600 hover:to-[#6e0f2c] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Launch Interactive Cake Designer</span>
              </button>

              <button
                onClick={() => onNavigate('custom-cake')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upload Custom Cake Quote</span>
              </button>

              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${config.businessName}, I would like to consult with a cake designer for a custom celebration cake.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Decorative motif in background */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* 6. HOW ORDERING WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
            Simple & Fast
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
            How Ordering Works
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Effortless cake delivery in 3 seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#EADBCE]">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-[#881337] font-serif font-bold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-serif text-base font-bold text-[#2A1E17]">
              Choose Cake & Customize
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pick your weight (0.5 kg to 5 kg), gourmet flavour, and dietary preference (Eggless / With Egg). Add a handwritten piped message.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#EADBCE]">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-[#881337] font-serif font-bold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-serif text-base font-bold text-[#2A1E17]">
              Select Delivery Slot
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Choose your celebration date and convenient 3-hour delivery window. Same-day orders accepted before {config.sameDayCutoffHour}:00 PM!
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#EADBCE]">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-[#881337] font-serif font-bold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-serif text-base font-bold text-[#2A1E17]">
              Confirm on WhatsApp & Enjoy
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive your unique Order ID, confirm details instantly on WhatsApp with our team, and track baking progress live!
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="bg-white py-16 border-y border-[#EADBCE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
                Real Celebrations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
                Loved by Hyderabad Families
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Verified reviews from recent birthdays, weddings, and weekend treats.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <span>{config.ratingScore} / 5.0 Average Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EADBCE] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EADBCE] text-xs">
                  <p className="font-semibold text-stone-900">{rev.customerName}</p>
                  <p className="text-[11px] text-stone-500">{rev.locality}</p>
                  <p className="text-[10px] text-[#881337] mt-1 font-medium">
                    Ordered: {rev.cakeOrdered}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM-STYLE GALLERY PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
            #SweetCrumbsHyderabad
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
            Fresh from the Kitchen Gallery
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Follow our daily cake decorating stories on Instagram.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredCakes.slice(0, 6).map((cake, i) => (
            <div
              key={cake.id}
              onClick={() => onSelectCake(cake)}
              className="group relative rounded-xl overflow-hidden border border-[#EADBCE] cursor-pointer"
            >
              <CakeIllustration
                name={cake.name}
                category={cake.category}
                themeColor={cake.themeColor}
                aspectRatio="1/1"
                showBadge={false}
              />
              <div className="absolute inset-0 bg-[#2A1E17]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[11px] font-semibold">
                {cake.name}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-[#881337] transition-colors"
          >
            <span>Follow @sweetcrumbsbakery on Instagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 9. CONTACT & STOREFRONT CALLOUT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
                Visit Our Studio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17]">
                Baking Happiness in Banjara Hills
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Walk into our boutique cake parlour to sample sponge pairings, consult on wedding tiers, or pick up a freshly frosted order.
              </p>

              <div className="space-y-2 text-xs text-stone-700 pt-1">
                <p>
                  <strong>Address:</strong> {config.address}, {config.landmark}, {config.city} - {config.pincode}
                </p>
                <p>
                  <strong>Daily Hours:</strong> {config.openingTime} – {config.closingTime}
                </p>
                <p>
                  <strong>Helpline:</strong> {config.phone}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <a
                  href={`tel:${config.phone}`}
                  className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#881337] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Bakery</span>
                </a>
                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  View Map & Directions
                </button>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] p-6 text-center space-y-3 flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 rounded-full bg-white border border-[#EADBCE] text-[#881337] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2A1E17]">
                Hyderabad Delivery Express
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Serving Banjara Hills, Jubilee Hills, Madhapur, Gachibowli, Hitec City, Kondapur, and Secunderabad within 60–90 minutes.
              </p>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● Live Delivery Routes Operating Today
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

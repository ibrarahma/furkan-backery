import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Cake, CakeCategory } from '../types/cake';
import { CakeCard } from '../components/cake/CakeCard';
import { CategorySlider } from '../components/cake/CategorySlider';
import { getBakeryConfig } from '../config/bakeryConfig';

interface MenuPageProps {
  cakes: Cake[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectCake: (cake: Cake) => void;
}

export function MenuPage({
  cakes,
  selectedCategory,
  onSelectCategory,
  onSelectCake
}: MenuPageProps) {
  const config = getBakeryConfig();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'eggless' | 'regular'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under500' | '500to800' | 'above800'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'priceLowHigh' | 'priceHighLow' | 'rating'>('popularity');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories: CakeCategory[] = [
    'Birthday Cakes',
    'Anniversary Cakes',
    'Chocolate Cakes',
    'Wedding Cakes',
    'Photo Cakes',
    'Eggless Cakes',
    'Kids Cakes',
    'Custom Cakes',
    'Cupcakes',
    'Pastries'
  ];

  // Filtering and sorting
  const filteredCakes = useMemo(() => {
    return cakes
      .filter((cake) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = cake.name.toLowerCase().includes(q);
          const matchDesc = cake.description.toLowerCase().includes(q);
          const matchFlavour = cake.availableFlavours.some((f) => f.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchFlavour) return false;
        }

        // Category filter
        if (selectedCategory !== 'All Cakes' && cake.category !== selectedCategory) {
          // Special case: "Eggless Cakes" category also shows egglessByDefault cakes
          if (selectedCategory === 'Eggless Cakes' && cake.isEgglessByDefault) {
            // Keep
          } else {
            return false;
          }
        }

        // Dietary filter
        if (dietaryFilter === 'eggless' && !cake.isEgglessByDefault) return false;
        if (dietaryFilter === 'regular' && cake.isEgglessByDefault) return false;

        // Price range
        if (priceRange === 'under500' && cake.basePrice >= 500) return false;
        if (priceRange === '500to800' && (cake.basePrice < 500 || cake.basePrice > 800)) return false;
        if (priceRange === 'above800' && cake.basePrice <= 800) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLowHigh') return a.basePrice - b.basePrice;
        if (sortBy === 'priceHighLow') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: popularity
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.reviewCount - a.reviewCount;
      });
  }, [cakes, searchQuery, selectedCategory, dietaryFilter, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    onSelectCategory('All Cakes');
    setDietaryFilter('all');
    setPriceRange('all');
    setSortBy('popularity');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All Cakes' ||
    dietaryFilter !== 'all' ||
    priceRange !== 'all' ||
    sortBy !== 'popularity';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
          Handcrafted Daily
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17]">
          Artisanal Cake Menu
        </h1>
        <p className="text-stone-600 text-sm">
          Baked fresh for birthdays, anniversaries, and personal treats. Choose weight, flavor, and personalized message on cake details.
        </p>
      </div>

      {/* Category Pills Slider */}
      <CategorySlider
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        categories={categories}
      />

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cake name, chocolate, fruit, red velvet..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] transition-colors"
            />
          </div>

          {/* Quick Filters Group */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto no-scrollbar">
            {/* Dietary Selector */}
            <select
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value as any)}
              aria-label="Filter by dietary preference"
              className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-stone-700 focus:outline-none focus:border-[#881337] cursor-pointer"
            >
              <option value="all">All Dietary</option>
              <option value="eggless">🌱 Eggless Only</option>
              <option value="regular">🥚 Contains Egg</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              aria-label="Filter by price range"
              className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-stone-700 focus:outline-none focus:border-[#881337] cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="under500">Under ₹500</option>
              <option value="500to800">₹500 - ₹800</option>
              <option value="above800">Above ₹800</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort cakes by"
              className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-stone-700 focus:outline-none focus:border-[#881337] cursor-pointer font-medium"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
                title="Reset all filters"
                aria-label="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results count & status */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>
            Showing <strong className="text-stone-800">{filteredCakes.length}</strong> cakes
            {selectedCategory !== 'All Cakes' ? ` in ${selectedCategory}` : ''}
          </span>
          <span className="text-[11px] text-stone-400">
            Prices shown for 0.5 kg base size
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredCakes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} onSelect={onSelectCake} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EADBCE] space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
            No cakes matched your criteria
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Try adjusting your search terms, removing price bounds, or resetting to "All Cakes".
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#881337] text-white text-xs font-semibold rounded-xl hover:bg-[#6b0f2c] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  RotateCcw,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Square,
  Circle,
  Palette,
  Layers,
  Flame,
  Type,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Info,
  Calendar,
  Clock,
  Trash2,
  FolderOpen
} from 'lucide-react';
import {
  CustomCakeDesign,
  CakeShape,
  CakeSize,
  SpongeFlavour,
  FrostingType,
  FillingType,
  DecorationId
} from '../types/cakeDesigner';
import {
  defaultCakeDesign,
  getCakeDesignerConfig,
  CakeDesignerConfig
} from '../config/cakeDesignerConfig';
import { calculateCustomCakePrice } from '../utils/cakeDesignerPricing';
import { CakePreview } from '../components/cakeDesigner/CakePreview';
import { BakeryConfig } from '../config/bakeryConfig';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { storage } from '../services/storage';

interface CakeDesignerPageProps {
  config: BakeryConfig;
  onNavigateToCart: () => void;
  onNavigateToMenu: () => void;
  initialDesign?: CustomCakeDesign;
}

const SAVED_DESIGNS_KEY = 'sweetcrumbs_saved_custom_designs_v1';
const DRAFT_DESIGN_KEY = 'sweetcrumbs_draft_custom_design_v1';

export function CakeDesignerPage({
  config,
  onNavigateToCart,
  onNavigateToMenu,
  initialDesign
}: CakeDesignerPageProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const designerConfig = useMemo(() => getCakeDesignerConfig(), []);

  // Current active step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Active cake design state
  const [design, setDesign] = useState<CustomCakeDesign>(() => {
    if (initialDesign) return initialDesign;
    const draft = storage.get<CustomCakeDesign | null>(DRAFT_DESIGN_KEY, null);
    if (draft) return draft;
    return { ...defaultCakeDesign, id: `design-${Date.now()}` };
  });

  // Saved designs drawer/modal
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<CustomCakeDesign[]>(() => {
    return storage.get<CustomCakeDesign[]>(SAVED_DESIGNS_KEY, []);
  });

  // Delivery options for custom order
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('05:00 PM - 09:00 PM');
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // Auto-save draft so user doesn't lose progress
  useEffect(() => {
    storage.set(DRAFT_DESIGN_KEY, design);
  }, [design]);

  // Pricing
  const priceInfo = useMemo(() => {
    return calculateCustomCakePrice(design, designerConfig);
  }, [design, designerConfig]);

  const totalCustomPrice = priceInfo.totalPrice * quantity;

  // Step 1: Shape & Size Handlers
  const handleShapeSelect = (shape: CakeShape) => {
    setDesign((prev) => ({ ...prev, shape }));
  };

  const handleSizeSelect = (size: CakeSize) => {
    setDesign((prev) => ({ ...prev, size }));
  };

  // Step 2: Sponge & Filling
  const handleSpongeSelect = (sponge: SpongeFlavour) => {
    setDesign((prev) => ({ ...prev, sponge }));
  };

  const handleFillingSelect = (filling: FillingType) => {
    setDesign((prev) => ({ ...prev, filling }));
  };

  // Step 3: Frosting & Color
  const handleFrostingTypeSelect = (frosting: FrostingType) => {
    setDesign((prev) => ({ ...prev, frosting }));
  };

  const handleColorPresetSelect = (preset: { name: string; hex: string }) => {
    setDesign((prev) => ({
      ...prev,
      frostingColor: preset.hex,
      frostingColorName: preset.name
    }));
  };

  const handleCustomColorChange = (hex: string) => {
    setDesign((prev) => ({
      ...prev,
      frostingColor: hex,
      frostingColorName: 'Custom Palette'
    }));
  };

  // Step 4: Decorations
  const handleToggleDecoration = (id: DecorationId) => {
    setDesign((prev) => {
      const exists = prev.decorations.includes(id);
      const updated = exists
        ? prev.decorations.filter((d) => d !== id)
        : [...prev.decorations, id];
      return { ...prev, decorations: updated };
    });
  };

  // Step 5: Message & Message Color
  const handleMessageChange = (text: string) => {
    setDesign((prev) => ({ ...prev, cakeMessage: text }));
  };

  const handleMessageColorSelect = (hex: string) => {
    setDesign((prev) => ({ ...prev, messageColor: hex }));
  };

  // View toggle
  const toggleViewAngle = () => {
    setDesign((prev) => ({
      ...prev,
      viewAngle: prev.viewAngle === '3d' ? 'top' : '3d'
    }));
  };

  // Reset & Start Again
  const handleResetDesign = () => {
    if (window.confirm('Reset current cake design to default?')) {
      const reset = {
        ...defaultCakeDesign,
        id: `design-${Date.now()}`
      };
      setDesign(reset);
      setCurrentStep(1);
      showToast('Design Reset', 'Started with fresh blank canvas', 'info');
    }
  };

  // Save current design to localStorage
  const handleSaveDesign = () => {
    const newSaved = [
      {
        ...design,
        id: `saved-${Date.now()}`,
        name: design.cakeMessage.trim()
          ? `${design.shape} "${design.cakeMessage}"`
          : `Custom ${design.shape} ${design.sponge} Cake`
      },
      ...savedDesigns
    ];
    setSavedDesigns(newSaved);
    storage.set(SAVED_DESIGNS_KEY, newSaved);
    showToast('Design Saved!', 'You can reload it anytime from "Saved Designs".', 'success');
  };

  const handleLoadSavedDesign = (saved: CustomCakeDesign) => {
    setDesign({ ...saved, id: `design-${Date.now()}` });
    setShowSavedModal(false);
    showToast('Design Loaded', `Loaded "${saved.name || saved.shape + ' Cake'}"`, 'success');
  };

  const handleDeleteSavedDesign = (id: string) => {
    const filtered = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(filtered);
    storage.set(SAVED_DESIGNS_KEY, filtered);
  };

  // Duplicate current design
  const handleDuplicateDesign = () => {
    const dup = { ...design, id: `design-copy-${Date.now()}` };
    setDesign(dup);
    showToast('Design Duplicated', 'You are now editing a duplicate copy.', 'info');
  };

  // Add to Cart
  const handleAddToCart = () => {
    const decorNames = design.decorations
      .map((d) => d.replace(/_/g, ' '))
      .join(', ');

    const item = {
      id: `custom-cake-${design.id}-${Date.now()}`,
      cakeId: 'custom-designed-cake',
      cakeName: `Custom ${design.shape} ${design.sponge} Cake`,
      category: 'Custom Cakes',
      themeColor: design.frostingColor,
      size: design.size,
      flavour: `${design.sponge} Sponge with ${design.filling} Filling & ${design.frostingColorName} ${design.frosting}`,
      isEggless: design.isEggless,
      cakeMessage: design.cakeMessage.trim(),
      specialInstructions: [
        `Decorations: ${decorNames || 'None'}`,
        specialNotes.trim()
      ]
        .filter(Boolean)
        .join(' · '),
      deliveryDate,
      deliveryTimeSlot,
      unitPrice: priceInfo.totalPrice,
      quantity,
      customCakeDesign: design
    };

    addToCart(item);
    showToast(
      'Custom Cake Added to Cart!',
      `${design.shape} ${design.size} · ₹${totalCustomPrice}`,
      'success'
    );
    setIsCartOpen(true);
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    const decorList = design.decorations.length > 0
      ? design.decorations
          .map((d) => d.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
          .join(', ')
      : 'None';

    const lines = [
      `*CUSTOM CAKE ORDER*`,
      `🎂 *${config.businessName}*`,
      '',
      `Shape: ${design.shape}`,
      `Weight: ${design.size}`,
      `Sponge: ${design.sponge}`,
      `Filling: ${design.filling}`,
      `Frosting: ${design.frostingColorName} ${design.frosting}`,
      `Frosting Color Code: ${design.frostingColor}`,
      `Decorations: ${decorList}`,
      `Cake Message: ${design.cakeMessage.trim() ? `"${design.cakeMessage.trim()}"` : 'None'}`,
      `Dietary: ${design.isEggless ? '100% Eggless' : 'Contains Egg'}`,
      `Quantity: ${quantity}`,
      `Estimated Total: ${config.currency}${totalCustomPrice}`,
      '',
      `Delivery Date: ${deliveryDate}`,
      `Delivery Slot: ${deliveryTimeSlot}`,
      specialNotes.trim() ? `Special Notes: ${specialNotes.trim()}` : '',
      '',
      `Hi, I have designed this custom cake on your website builder and would like to confirm my order!`
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const stepsList = [
    { num: 1, title: 'Shape & Size', icon: Square },
    { num: 2, title: 'Sponge & Filling', icon: Layers },
    { num: 3, title: 'Frosting & Colour', icon: Palette },
    { num: 4, title: 'Decorations', icon: Flame },
    { num: 5, title: 'Cake Message', icon: Type },
    { num: 6, title: 'Review & Order', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Banner / Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#EADBCE] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#881337] animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
              Interactive Bakery Studio
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2A1E17] mt-0.5">
            Design Your Own Cake
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Inspired by the classic cake-making bakery game — build your dream cake step-by-step with real-time 3D & top-down preview!
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetDesign}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#EADBCE] text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Reset and start again"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Design</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDesign}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#EADBCE] text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Save design to browser storage"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Save Design</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSavedModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#EADBCE] text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="View previously saved designs"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Saved ({savedDesigns.length})</span>
          </button>

          <button
            type="button"
            onClick={handleDuplicateDesign}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#EADBCE] text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Duplicate design"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>Duplicate</span>
          </button>
        </div>
      </div>

      {/* Guided Progress Station Bar (Station 1 to 6) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EADBCE] shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[540px] gap-2">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2A1E17] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-stone-600 hover:bg-[#FAF7F2]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#881337] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Left Preview, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: LIVE VISUAL PREVIEW & INSTANT PRICE SUMMARY */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          {/* Cake Visual Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EADBCE] shadow-md relative overflow-hidden">
            <CakePreview
              design={design}
              onToggleViewAngle={toggleViewAngle}
            />

            {/* Live Price Strip below cake */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">Estimated Cake Price:</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-[#881337]">
                  {config.currency}{priceInfo.totalPrice}
                </span>
                <span className="text-xs text-stone-500 ml-1.5">
                  ({design.size})
                </span>
              </div>

              {/* Eggless switch */}
              <button
                type="button"
                onClick={() => setDesign((prev) => ({ ...prev, isEggless: !prev.isEggless }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  design.isEggless
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                    : 'bg-amber-50 border-amber-700 text-amber-900'
                }`}
                title="Toggle Vegetarian / Eggless formulation"
              >
                <span className={`w-2 h-2 rounded-full ${design.isEggless ? 'bg-emerald-600' : 'bg-amber-700'}`} />
                <span>{design.isEggless ? '100% Eggless' : 'With Egg'}</span>
              </button>
            </div>
          </div>

          {/* Quick Itemized Price Box */}
          <div className="bg-white rounded-2xl p-4 border border-[#EADBCE] text-xs space-y-2">
            <div className="flex justify-between font-bold text-stone-800 pb-1 border-b border-stone-100">
              <span>Price Summary</span>
              <span>{config.currency}{priceInfo.totalPrice}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Base ({design.size})</span>
              <span className="font-mono tabular-nums">{config.currency}{priceInfo.basePrice}</span>
            </div>
            {priceInfo.customizationCharges > 0 && (
              <div className="flex justify-between text-[#881337] font-medium">
                <span>Custom Shape, Fillings & Decor</span>
                <span className="font-mono tabular-nums">+{config.currency}{priceInfo.customizationCharges}</span>
              </div>
            )}
            <p className="text-[10px] text-stone-400 pt-1">
              *Real-time pricing. Same-day baking available in {config.city}.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: STEP-BY-STEP CUSTOMIZATION STATIONS */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EADBCE] shadow-xs space-y-6 min-h-[460px]">
            {/* ------------------------------------------------------------ */}
            {/* STATION 1: SHAPE & SIZE */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                    Station 1 of 6
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Choose Cake Shape & Size
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Select the foundational silhouette and party serving capacity.
                  </p>
                </div>

                {/* Shape Choices */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    A. Cake Mold Shape:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { shape: 'Round' as CakeShape, icon: Circle, desc: 'Classic Cylinder', fee: 0 },
                      { shape: 'Square' as CakeShape, icon: Square, desc: 'Modern Cube', fee: designerConfig.shapeSurcharges.Square },
                      { shape: 'Heart' as CakeShape, icon: Heart, desc: 'Romantic Heart', fee: designerConfig.shapeSurcharges.Heart }
                    ].map((s) => {
                      const Icon = s.icon;
                      const isSelected = design.shape === s.shape;
                      return (
                        <button
                          key={s.shape}
                          type="button"
                          onClick={() => handleShapeSelect(s.shape)}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] hover:border-stone-400 bg-white'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-[#881337]' : 'text-stone-500'}`} />
                          <span className="text-xs font-bold text-stone-900">{s.shape}</span>
                          <span className="text-[10px] text-stone-500">{s.desc}</span>
                          <span className="text-[10px] font-mono font-semibold text-[#881337]">
                            {s.fee > 0 ? `+${config.currency}${s.fee}` : 'Standard'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Choices */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    B. Weight / Size:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg'] as CakeSize[]).map((size) => {
                      const isSelected = design.size === size;
                      const basePrice = designerConfig.basePricesBySize[size];
                      const servings = designerConfig.servingsBySize[size];
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeSelect(size)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] hover:border-stone-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">{size}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                          </div>
                          <p className="text-[10px] text-stone-500 mt-0.5">{servings}</p>
                          <p className="text-xs font-mono font-bold text-[#881337] mt-1">
                            {config.currency}{basePrice}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STATION 2: SPONGE & FILLING */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                    Station 2 of 6
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Select Sponge Flavour & Inner Filling
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Baked fresh with pure butter, rich cocoa, and natural fruit purees.
                  </p>
                </div>

                {/* Sponge Flavours */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    A. Sponge Flavour Base:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { flavour: 'Chocolate' as SpongeFlavour, color: '#3D2415', fee: 0 },
                      { flavour: 'Vanilla' as SpongeFlavour, color: '#F5D061', fee: 0 },
                      { flavour: 'Strawberry' as SpongeFlavour, color: '#F472B6', fee: designerConfig.spongeSurcharges.Strawberry },
                      { flavour: 'Red Velvet' as SpongeFlavour, color: '#881337', fee: designerConfig.spongeSurcharges['Red Velvet'] },
                      { flavour: 'Butterscotch' as SpongeFlavour, color: '#D97706', fee: designerConfig.spongeSurcharges.Butterscotch }
                    ].map((sp) => {
                      const isSelected = design.sponge === sp.flavour;
                      return (
                        <button
                          key={sp.flavour}
                          type="button"
                          onClick={() => handleSpongeSelect(sp.flavour)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] bg-white hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                            style={{ backgroundColor: sp.color }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-stone-900 block truncate">{sp.flavour}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {sp.fee > 0 ? `+${config.currency}${sp.fee}` : 'Included'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filling Choices */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    B. Between-Layer Filling:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { filling: 'No filling' as FillingType, fee: 0 },
                      { filling: 'Vanilla' as FillingType, fee: designerConfig.fillingSurcharges.Vanilla },
                      { filling: 'Chocolate' as FillingType, fee: designerConfig.fillingSurcharges.Chocolate },
                      { filling: 'Strawberry' as FillingType, fee: designerConfig.fillingSurcharges.Strawberry },
                      { filling: 'Butterscotch' as FillingType, fee: designerConfig.fillingSurcharges.Butterscotch }
                    ].map((fil) => {
                      const isSelected = design.filling === fil.filling;
                      return (
                        <button
                          key={fil.filling}
                          type="button"
                          onClick={() => handleFillingSelect(fil.filling)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] bg-white hover:border-stone-400'
                          }`}
                        >
                          <span className="text-xs font-bold text-stone-900 block">{fil.filling}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {fil.fee > 0 ? `+${config.currency}${fil.fee}` : 'No extra charge'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STATION 3: FROSTING & COLOUR */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                    Station 3 of 6
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Apply Frosting & Choose Cream Colour
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Silky whipped cream and rich buttercreams with custom color tinting.
                  </p>
                </div>

                {/* Frosting Types */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    A. Frosting Texture & Type:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Buttercream', 'Chocolate', 'Vanilla', 'Strawberry', 'Blueberry'] as FrostingType[]).map((fr) => {
                      const isSelected = design.frosting === fr;
                      return (
                        <button
                          key={fr}
                          type="button"
                          onClick={() => handleFrostingTypeSelect(fr)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                              : 'bg-white text-stone-700 border-[#EADBCE] hover:border-stone-400'
                          }`}
                        >
                          {fr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frosting Colour Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    B. Frosting Colour Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {designerConfig.presetColors.map((color) => {
                      const isSelected = design.frostingColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleColorPresetSelect(color)}
                          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] bg-white hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-stone-900 block truncate">{color.name}</span>
                            <span className="text-[10px] text-stone-500">{color.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Colour Picker */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Custom Frosting Colour Picker
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Mix your exact dream shade (Pastels, Royal Blues, Lilac, etc.)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.frostingColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-[#EADBCE] cursor-pointer bg-white p-0.5"
                      title="Choose custom frosting colour"
                    />
                    <span className="text-xs font-mono font-bold text-stone-700 uppercase">
                      {design.frostingColor}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STATION 4: DECORATIONS & CANDLES */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                    Station 4 of 6
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Add Gourmet Decorations & Candles
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Select multiple toppings. They will render live on the cake preview!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {designerConfig.decorations.map((dec) => {
                    const isSelected = design.decorations.includes(dec.id);
                    return (
                      <button
                        key={dec.id}
                        type="button"
                        onClick={() => handleToggleDecoration(dec.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                            : 'border-[#EADBCE] bg-white hover:border-stone-400'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{dec.name}</span>
                            <span className="text-[10px] font-mono font-semibold text-[#881337]">
                              +{config.currency}{dec.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">{dec.description}</p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#881337] border-[#881337] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCE]">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    You have selected <strong>{design.decorations.length}</strong> decoration(s). Switch to "Top-Down View" above to inspect placement from all angles!
                  </span>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STATION 5: CAKE MESSAGE */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                    Station 5 of 6
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Personalized Calligraphy Message
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Hand-piped on the cake surface with edible royal icing.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="designer-msg-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Cake Message Text (Max 35 Characters):
                    </label>
                    <span className="text-[11px] text-stone-400">
                      {design.cakeMessage.length}/35
                    </span>
                  </div>
                  <input
                    id="designer-msg-input"
                    type="text"
                    maxLength={35}
                    value={design.cakeMessage}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    placeholder="e.g. Happy Birthday Ibrar"
                    className="w-full text-sm px-4 py-3 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] font-serif"
                  />
                  <p className="text-[11px] text-stone-500">
                    Watch the message update immediately on the cake preview above!
                  </p>
                </div>

                {/* Message Piping Color */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Piping Text Colour:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {designerConfig.messageColors.map((mc) => {
                      const isSelected = design.messageColor.toLowerCase() === mc.hex.toLowerCase();
                      return (
                        <button
                          key={mc.name}
                          type="button"
                          onClick={() => handleMessageColorSelect(mc.hex)}
                          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#881337] bg-[#FAF7F2] ring-2 ring-[#881337]/20 shadow-xs'
                              : 'border-[#EADBCE] bg-white hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: mc.hex }}
                          />
                          <span className="text-xs font-semibold text-stone-900">{mc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STATION 6: REVIEW & ORDER */}
            {/* ------------------------------------------------------------ */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Station 6 of 6 · Review Your Creation
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17]">
                    Ready to Bake!
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Verify all recipe specifications and place your custom order.
                  </p>
                </div>

                {/* Full Spec Grid */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE] text-xs space-y-2 text-stone-700">
                  <div className="grid grid-cols-2 gap-2">
                    <p><strong>Shape:</strong> {design.shape}</p>
                    <p><strong>Size / Weight:</strong> {design.size}</p>
                    <p><strong>Sponge:</strong> {design.sponge}</p>
                    <p><strong>Filling:</strong> {design.filling}</p>
                    <p><strong>Frosting:</strong> {design.frostingColorName} {design.frosting}</p>
                    <p><strong>Dietary:</strong> {design.isEggless ? '100% Eggless' : 'Contains Egg'}</p>
                  </div>
                  <div className="pt-2 border-t border-[#EADBCE]/80">
                    <p>
                      <strong>Decorations:</strong>{' '}
                      {design.decorations.length > 0
                        ? design.decorations.map((d) => d.replace(/_/g, ' ')).join(', ')
                        : 'None'}
                    </p>
                    {design.cakeMessage.trim() && (
                      <p className="mt-1">
                        <strong>Piped Message:</strong>{' '}
                        <span className="font-serif italic text-[#881337]">"{design.cakeMessage.trim()}"</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <h3 className="font-bold text-stone-800">Itemized Price Breakdown:</h3>
                  {priceInfo.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-stone-600">
                      <span>{item.label}</span>
                      <span className="font-mono tabular-nums">{config.currency}{item.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm text-[#2A1E17] pt-2 border-t border-stone-200">
                    <span>Unit Price</span>
                    <span className="font-mono text-base text-[#881337]">{config.currency}{priceInfo.totalPrice}</span>
                  </div>
                </div>

                {/* Delivery Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#EADBCE] rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Time Slot
                    </label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#EADBCE] rounded-xl focus:outline-none"
                    >
                      <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Morning)</option>
                      <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon)</option>
                      <option value="05:00 PM - 09:00 PM">05:00 PM - 09:00 PM (Evening)</option>
                      <option value="11:00 PM - 12:00 AM">11:00 PM - 12:00 AM (Midnight)</option>
                    </select>
                  </div>
                </div>

                {/* Quantity and Extra Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center border border-[#EADBCE] rounded-xl overflow-hidden bg-[#FAF7F2] h-10">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 h-full hover:bg-stone-200"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs font-mono">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 h-full hover:bg-stone-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Special Baking Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Less sugar, extra sparkler candles..."
                      className="w-full text-xs px-3 py-2.5 bg-white border border-[#EADBCE] rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Primary Actions Strip */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Cake to Cart ({config.currency}{totalCustomPrice})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* Station Stepper Forward/Backward Controls */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Station</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2A1E17] hover:bg-[#881337] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Next: {stepsList[currentStep].title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#881337] hover:bg-[#6e0f2c] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Finish & Add to Cart</span>
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SAVED DESIGNS MODAL */}
      {/* ============================================================== */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-[#EADBCE] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
                  Your Saved Cake Designs ({savedDesigns.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedModal(false)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            {savedDesigns.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-500">
                You haven't saved any cake designs yet. Use "Save Design" at any time to bookmark your creations!
              </div>
            ) : (
              <div className="space-y-3">
                {savedDesigns.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-900">
                        {saved.name || `${saved.shape} ${saved.sponge} Cake`}
                      </p>
                      <p className="text-stone-500 text-[11px]">
                        {saved.size} · {saved.sponge} · {saved.frostingColorName} Frosting
                      </p>
                      {saved.cakeMessage && (
                        <p className="italic text-[#881337] text-[11px]">"{saved.cakeMessage}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedDesign(saved)}
                        className="px-3 py-1.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold rounded-lg text-xs"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedDesign(saved.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                        title="Delete saved design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

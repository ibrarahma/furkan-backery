export type CakeCategory =
  | 'Birthday Cakes'
  | 'Anniversary Cakes'
  | 'Chocolate Cakes'
  | 'Wedding Cakes'
  | 'Photo Cakes'
  | 'Eggless Cakes'
  | 'Kids Cakes'
  | 'Custom Cakes'
  | 'Cupcakes'
  | 'Pastries';

export interface CakeSizeOption {
  weight: string; // e.g. "0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "5 kg"
  servings: string; // e.g. "4-6 people"
  priceMultiplier: number; // base price * multiplier
}

export const DEFAULT_CAKE_SIZES: CakeSizeOption[] = [
  { weight: '0.5 kg', servings: '4 - 6 people', priceMultiplier: 1.0 },
  { weight: '1 kg', servings: '8 - 12 people', priceMultiplier: 1.85 },
  { weight: '1.5 kg', servings: '12 - 16 people', priceMultiplier: 2.7 },
  { weight: '2 kg', servings: '18 - 22 people', priceMultiplier: 3.5 },
  { weight: '3 kg', servings: '25 - 30 people', priceMultiplier: 5.2 },
  { weight: '5 kg', servings: '45 - 55 people', priceMultiplier: 8.5 },
];

export interface Cake {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: CakeCategory;
  basePrice: number; // Price for 0.5 kg base size
  isEgglessByDefault: boolean;
  egglessAllowed: boolean;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  prepTimeHours: number; // e.g. 3 hours for fast prep
  themeColor: string; // For stylized fallback illustration
  accentFlavor: string;
  availableFlavours: string[];
  allergens?: string[];
  imageUrl?: string;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
  minOrderValue: number;
  description: string;
  active: boolean;
}

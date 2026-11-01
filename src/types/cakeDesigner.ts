/**
 * Types for "Design Your Own Cake" Interactive Feature
 */

export type CakeShape = 'Round' | 'Square' | 'Heart';

export type CakeSize = '0.5 kg' | '1 kg' | '1.5 kg' | '2 kg' | '3 kg';

export type SpongeFlavour =
  | 'Chocolate'
  | 'Vanilla'
  | 'Strawberry'
  | 'Red Velvet'
  | 'Butterscotch';

export type FrostingType =
  | 'Chocolate'
  | 'Vanilla'
  | 'Strawberry'
  | 'Blueberry'
  | 'Buttercream';

export type FillingType =
  | 'Chocolate'
  | 'Strawberry'
  | 'Vanilla'
  | 'Butterscotch'
  | 'No filling';

export type DecorationId =
  | 'sprinkles'
  | 'cherries'
  | 'strawberries'
  | 'chocolate_chips'
  | 'candles'
  | 'chocolate_drizzle'
  | 'birthday_topper'
  | 'heart_decorations';

export interface DecorationOption {
  id: DecorationId;
  name: string;
  price: number;
  iconName: string;
  description: string;
}

export interface CustomCakeDesign {
  id: string;
  shape: CakeShape;
  size: CakeSize;
  sponge: SpongeFlavour;
  filling: FillingType;
  frosting: FrostingType;
  frostingColor: string; // Hex color code
  frostingColorName: string; // e.g. "Pink", "White", "Custom"
  decorations: DecorationId[];
  cakeMessage: string;
  messageColor: string; // Hex color
  isEggless: boolean;
  viewAngle: '3d' | 'top'; // 3D front perspective or top-down view
  createdAt: string;
  name?: string; // Optional custom name given by user, e.g. "Ibrar's Birthday Cake"
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
}

export interface CakeDesignPrice {
  basePrice: number;
  customizationCharges: number;
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
}

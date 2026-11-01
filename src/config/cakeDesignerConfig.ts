/**
 * Configuration for "Design Your Own Cake"
 * Inspired by Purble Place (Comfy Cakes)
 */
import {
  CakeShape,
  CakeSize,
  SpongeFlavour,
  FrostingType,
  FillingType,
  DecorationOption,
  CustomCakeDesign
} from '../types/cakeDesigner';

export interface CakeDesignerConfig {
  basePricesBySize: Record<CakeSize, number>;
  shapeSurcharges: Record<CakeShape, number>;
  spongeSurcharges: Record<SpongeFlavour, number>;
  fillingSurcharges: Record<FillingType, number>;
  decorations: DecorationOption[];
  presetColors: { name: string; hex: string; desc: string }[];
  messageColors: { name: string; hex: string }[];
  servingsBySize: Record<CakeSize, string>;
}

export const defaultCakeDesignerConfig: CakeDesignerConfig = {
  basePricesBySize: {
    '0.5 kg': 500,
    '1 kg': 900,
    '1.5 kg': 1300,
    '2 kg': 1700,
    '3 kg': 2400
  },

  servingsBySize: {
    '0.5 kg': '4 - 6 Servings',
    '1 kg': '8 - 12 Servings',
    '1.5 kg': '12 - 16 Servings',
    '2 kg': '18 - 22 Servings',
    '3 kg': '25 - 32 Servings'
  },

  shapeSurcharges: {
    Round: 0,
    Square: 50,
    Heart: 100
  },

  spongeSurcharges: {
    Chocolate: 0,
    Vanilla: 0,
    Strawberry: 40,
    'Red Velvet': 80,
    Butterscotch: 50
  },

  fillingSurcharges: {
    'No filling': 0,
    Vanilla: 40,
    Chocolate: 60,
    Strawberry: 60,
    Butterscotch: 60
  },

  decorations: [
    {
      id: 'sprinkles',
      name: 'Rainbow Sprinkles',
      price: 30,
      iconName: 'Sparkles',
      description: 'Festive multicolored crunchy sugar sprinkles'
    },
    {
      id: 'cherries',
      name: 'Fresh Cherries',
      price: 60,
      iconName: 'Cherry',
      description: 'Glistening ruby-red candied cherries with stems'
    },
    {
      id: 'strawberries',
      name: 'Fresh Strawberries',
      price: 70,
      iconName: 'Apple',
      description: 'Juicy glazed farm strawberry slices'
    },
    {
      id: 'chocolate_chips',
      name: 'Chocolate Chips',
      price: 40,
      iconName: 'Cookie',
      description: 'Gourmet dark Belgian chocolate morsels'
    },
    {
      id: 'candles',
      name: 'Celebration Candles',
      price: 40,
      iconName: 'Flame',
      description: 'Lit striped birthday candles with glowing flame'
    },
    {
      id: 'chocolate_drizzle',
      name: 'Chocolate Drizzle',
      price: 50,
      iconName: 'Droplet',
      description: 'Rich cascading dark chocolate ganache drip'
    },
    {
      id: 'birthday_topper',
      name: 'Birthday Topper',
      price: 80,
      iconName: 'Crown',
      description: 'Shimmering golden "Happy Birthday" celebration plaque'
    },
    {
      id: 'heart_decorations',
      name: 'Sugar Hearts',
      price: 50,
      iconName: 'Heart',
      description: 'Delicate edible pink and crimson sugar hearts'
    }
  ],

  presetColors: [
    { name: 'Pink', hex: '#F472B6', desc: 'Sweet Blossom Pink' },
    { name: 'White', hex: '#FFFDF9', desc: 'Pure Ivory Cream' },
    { name: 'Chocolate Brown', hex: '#4A2E1B', desc: 'Rich Belgian Cocoa' },
    { name: 'Blue', hex: '#60A5FA', desc: 'Sky Blue Buttercream' },
    { name: 'Yellow', hex: '#FDE047', desc: 'Sunny Butterscotch' },
    { name: 'Green', hex: '#86EFAC', desc: 'Pistachio Mint' }
  ],

  messageColors: [
    { name: 'Dark Chocolate', hex: '#2A1810' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Golden Honey', hex: '#D97706' },
    { name: 'Crimson Red', hex: '#BE123C' },
    { name: 'Blush Pink', hex: '#DB2777' },
    { name: 'Royal Blue', hex: '#1D4ED8' }
  ]
};

export const defaultCakeDesign: CustomCakeDesign = {
  id: 'design-default',
  shape: 'Round',
  size: '1 kg',
  sponge: 'Chocolate',
  filling: 'Strawberry',
  frosting: 'Buttercream',
  frostingColor: '#F472B6', // Pink
  frostingColorName: 'Pink',
  decorations: ['cherries', 'sprinkles', 'candles'],
  cakeMessage: 'Happy Birthday Ibrar',
  messageColor: '#2A1810',
  isEggless: true,
  viewAngle: '3d',
  createdAt: new Date().toISOString()
};

const DESIGNER_CONFIG_KEY = 'sweetcrumbs_cake_designer_config_v1';

export function getCakeDesignerConfig(): CakeDesignerConfig {
  if (typeof window === 'undefined') return defaultCakeDesignerConfig;
  try {
    const saved = localStorage.getItem(DESIGNER_CONFIG_KEY);
    if (saved) {
      return { ...defaultCakeDesignerConfig, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load cake designer config:', e);
  }
  return defaultCakeDesignerConfig;
}

export function saveCakeDesignerConfig(cfg: CakeDesignerConfig): void {
  try {
    localStorage.setItem(DESIGNER_CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save cake designer config:', e);
  }
}

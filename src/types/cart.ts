export interface CartItem {
  id: string; // unique cart item key (cakeId + size + flavour + eggless + message)
  cakeId: string;
  cakeName: string;
  category: string;
  imageUrl?: string;
  themeColor: string;
  size: string;
  flavour: string;
  isEggless: boolean;
  cakeMessage: string;
  specialInstructions: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  unitPrice: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  freeDeliveryRemaining: number;
  appliedCouponCode: string | null;
}

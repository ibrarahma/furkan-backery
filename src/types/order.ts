import { CartItem } from './cart';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery / Pay at Store'
  | 'UPI / Advance Payment';

export type PaymentStatus =
  | 'Pending'
  | 'Advance Paid'
  | 'Paid'
  | 'COD Pending';

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  deliveryAddress: string;
  landmark: string;
  city: string;
  pincode: string;
}

export interface BakeryOrder {
  orderId: string; // e.g. SCB-20261008-4821
  createdAt: string; // ISO timestamp
  updatedAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions?: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string | null;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  adminNotes?: string;
  isCustomCakeInquiry?: boolean;
}

export interface CustomCakeInquiry {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  cakeType: string;
  weight: string;
  flavour: string;
  isEggless: boolean;
  theme: string;
  cakeMessage: string;
  referenceImageName?: string;
  deliveryDate: string;
  deliveryTime: string;
  budgetRange: string;
  specialInstructions: string;
  status: 'Inquiry Received' | 'Quoted' | 'Accepted' | 'Declined';
}

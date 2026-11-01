/**
 * Sweet Crumbs Bakery - Central Business Configuration
 * 
 * Edit this file or update via the Admin Settings tab to change
 * bakery details, delivery rates, contact info, and business hours.
 */

import { adminAuthService } from '../services/adminAuthService';

export interface BakeryConfig {
  businessName: string;
  tagline: string;
  city: string;
  state: string;
  phone: string;
  whatsappNumber: string; // international digits without + or spaces for wa.me links
  displayWhatsapp: string;
  email: string;
  address: string;
  landmark: string;
  pincode: string;
  instagramUrl: string;
  facebookUrl: string;
  deliveryCharges: number;
  freeDeliveryThreshold: number;
  minimumOrder: number;
  openingTime: string;
  closingTime: string;
  sameDayDelivery: boolean;
  sameDayCutoffHour: number; // 24-hour format (e.g. 18 for 6:00 PM)
  currency: string;
  fssaiNumber: string;
  ratingScore: number;
  totalReviewsCount: number;
  servingAreas: string[];
}

export const defaultBakeryConfig: BakeryConfig = {
  businessName: "FURKAN Cake and Bakery Shop",
  tagline: "Made with Love, Baked for You",
  city: "Korba",
  state: "Chhattisgarh",
  phone: "+91 7007802157",
  whatsappNumber: "917007802157", // wa.me format
  displayWhatsapp: "+91 7007802157",
  email: "ibrarahmadansare@gmail.com",
  address: "Shop No. 12, Main Road",
  landmark: "Near Korba",
  pincode: "500001",
  instagramUrl: "https://instagram.com/furkancakeandbakery",
  facebookUrl: "https://facebook.com/furkancakeandbakery",
  deliveryCharges: 80,
  freeDeliveryThreshold: 999,
  minimumOrder: 350,
  openingTime: "09:00 AM",
  closingTime: "10:30 PM",
  sameDayDelivery: true,
  sameDayCutoffHour: 19, // 7:00 PM
  currency: "₹",
  fssaiNumber: "13624011000842",
  ratingScore: 4.9,
  totalReviewsCount: 1420,
  servingAreas: [
    "Main Road",
    "Transport Nagar",
    "TP Nagar",
    "Niharika",
    "Kosabadi",
    "Rampur",
    "Balco Nagar",
    "Darri",
    "CSEB Colony",
    "Korba City"
  ]
};

let activeConfig: BakeryConfig = defaultBakeryConfig;

export async function fetchBakeryConfig(): Promise<BakeryConfig> {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return activeConfig;
    const data = await res.json();
    if (data && data.businessName) {
      activeConfig = data;
    }
    return activeConfig;
  } catch (err) {
    console.error('Error fetching bakery config:', err);
    return activeConfig;
  }
}

export function getBakeryConfig(): BakeryConfig {
  return activeConfig;
}

export async function saveBakeryConfig(config: BakeryConfig): Promise<BakeryConfig> {
  activeConfig = config;
  try {
    const res = await fetch('/api/admin/config', {
      method: 'PUT',
      headers: adminAuthService.getAuthHeaders(),
      body: JSON.stringify(config)
    });
    if (!res.ok) {
      console.warn('Config saved locally, server update responded with status', res.status);
    }
  } catch (err) {
    console.error('Error saving bakery config to server:', err);
  }
  return config;
}

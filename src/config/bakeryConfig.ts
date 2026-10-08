/**
 * Sweet Crumbs Bakery - Central Business Configuration
 * 
 * Edit this file or update via the Admin Settings tab to change
 * bakery details, delivery rates, contact info, and business hours.
 */

export interface BakeryConfig {
   businessName: "FURKAN Cake and Bakery Shop",
city: "korba",
state: "ChattisGhar",
phone: "+91 7007802157",
whatsappNumber: "917007802157",
displayWhatsapp: "+91 7007802157",
email: "ibrarahmadansare@gmail.com",
address: "Shop No. 12, Main Road",
landmark: "Near korba",
pincode: "500001",
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
  businessName: "Sweet Crumbs Bakery",
  tagline: "Made with Love, Baked for You",
  city: "Hyderabad",
  state: "Telangana",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210", // wa.me format
  displayWhatsapp: "+91 98765 43210",
  email: "hello@sweetcrumbsbakery.com",
  address: "Plot 42, Road No. 12, Banjara Hills",
  landmark: "Near City Center Mall",
  pincode: "500034",
  instagramUrl: "https://instagram.com/sweetcrumbsbakery",
  facebookUrl: "https://facebook.com/sweetcrumbsbakery",
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
    "Banjara Hills",
    "Jubilee Hills",
    "Madhapur",
    "Gachibowli",
    "Hitec City",
    "Kondapur",
    "Kukatpally",
    "Secunderabad",
    "Somajiguda",
    "Begumpet"
  ]
};

const CONFIG_STORAGE_KEY = "sweetcrumbs_bakery_config_v1";

export function getBakeryConfig(): BakeryConfig {
  if (typeof window === "undefined") return defaultBakeryConfig;
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...defaultBakeryConfig, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Failed to read bakery config from localStorage", e);
  }
  return defaultBakeryConfig;
}

export function saveBakeryConfig(config: BakeryConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save bakery config", e);
  }
}

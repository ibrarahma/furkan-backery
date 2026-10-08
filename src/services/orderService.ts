import { BakeryOrder, OrderStatus, PaymentStatus, CustomCakeInquiry } from '../types/order';
import { BakeryConfig } from '../config/bakeryConfig';
import { storage } from './storage';

const ORDERS_STORAGE_KEY = 'sweetcrumbs_orders_v1';
const INQUIRIES_STORAGE_KEY = 'sweetcrumbs_custom_inquiries_v1';

// Seed sample orders for realistic demo dashboard
const INITIAL_DEMO_ORDERS: BakeryOrder[] = [
  {
    orderId: 'SCB-20261008-4821',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    customer: {
      fullName: 'Priya Sharma',
      mobileNumber: '+91 9693650653',
      mobileNumber: '+91 7007802157',
      whatsappNumber: '+91 9693650653',
      email: 'ibrarahmadansare@gmail.com',
      deliveryAddress: 'Flat 402, Lotus Grandeur, Road 10, Banjara Hills',
      landmark: 'Opposite Park View Hotel',
      city: 'Hyderabad',
      pincode: '500034'
    },
    items: [
      {
        id: 'item-demo-1',
        cakeId: 'cake-01',
        cakeName: 'Classic Chocolate Truffle Cake',
        category: 'Chocolate Cakes',
        themeColor: '#3E2723',
        size: '1 kg',
        flavour: 'Belgian Dark Chocolate',
        isEggless: true,
        cakeMessage: 'Happy 25th Birthday Rahul!',
        specialInstructions: 'Please include 4 golden sparkler candles',
        deliveryDate: '2026-10-08',
        deliveryTimeSlot: '05:00 PM - 08:00 PM',
        unitPrice: 1017,
        quantity: 1
      }
    ],
    deliveryDate: '2026-10-08',
    deliveryTimeSlot: '05:00 PM - 08:00 PM',
    specialInstructions: 'Ring bell twice, do not leave in lobby.',
    subtotal: 1017,
    deliveryCharge: 0,
    discount: 101,
    couponCode: 'WELCOME10',
    grandTotal: 916,
    paymentMethod: 'UPI / Advance Payment',
    paymentStatus: 'Advance Paid',
    status: 'Preparing',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), note: 'Order received via online website' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), note: 'WhatsApp order confirmation verified' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), note: 'Pastry chef baking fresh sponge layer' }
    ]
  },
  {
    orderId: 'SCB-20261007-3104',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    customer: {
      fullName: 'Mohd Irfan',
      mobileNumber: '+91 91234 56789',
      whatsappNumber: '+91 91234 56789',
      email: 'irfan.hyd@example.com',
      deliveryAddress: 'Villa 18, Whispering Meadows, Gachibowli',
      landmark: 'Near Financial District Arch',
      city: 'Hyderabad',
      pincode: '500032'
    },
    items: [
      {
        id: 'item-demo-2',
        cakeId: 'cake-02',
        cakeName: 'Royal Red Velvet Cream Cheese Cake',
        category: 'Birthday Cakes',
        themeColor: '#881337',
        size: '1.5 kg',
        flavour: 'Signature Cream Cheese',
        isEggless: false,
        cakeMessage: 'Happy Anniversary Mom & Dad',
        specialInstructions: 'Neat calligraphy please',
        deliveryDate: '2026-10-07',
        deliveryTimeSlot: '01:00 PM - 04:00 PM',
        unitPrice: 1755,
        quantity: 1
      }
    ],
    deliveryDate: '2026-10-07',
    deliveryTimeSlot: '01:00 PM - 04:00 PM',
    subtotal: 1755,
    deliveryCharge: 0,
    discount: 0,
    grandTotal: 1755,
    paymentMethod: 'Cash on Delivery / Pay at Store',
    paymentStatus: 'Paid',
    status: 'Delivered',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { status: 'Preparing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
      { status: 'Ready', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString() },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
      { status: 'Delivered', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString() }
    ]
  }
];

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  // Random 4 digit number
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SCB-${year}${month}${day}-${rand}`;
}

export function getOrders(): BakeryOrder[] {
  const orders = storage.get<BakeryOrder[] | null>(ORDERS_STORAGE_KEY, null);
  if (orders && Array.isArray(orders)) {
    return orders;
  }
  // Initialize with realistic seed
  storage.set(ORDERS_STORAGE_KEY, INITIAL_DEMO_ORDERS);
  return INITIAL_DEMO_ORDERS;
}

export function getOrderById(orderId: string): BakeryOrder | undefined {
  const orders = getOrders();
  const cleaned = orderId.trim().toUpperCase();
  return orders.find((o) => o.orderId.toUpperCase() === cleaned);
}

export function findOrderByTrackInfo(orderId: string, phone: string): BakeryOrder | undefined {
  const orders = getOrders();
  const targetId = orderId.trim().toUpperCase();
  const targetPhone = phone.replace(/\D/g, ''); // strip non-digits

  return orders.find((o) => {
    const matchId = o.orderId.toUpperCase() === targetId;
    if (!matchId) return false;
    const cleanOrderPhone = o.customer.mobileNumber.replace(/\D/g, '');
    const cleanOrderWa = o.customer.whatsappNumber.replace(/\D/g, '');
    // If phone provided, ensure match or at least last 10 digits match
    if (!targetPhone) return true;
    return (
      cleanOrderPhone.endsWith(targetPhone.slice(-10)) ||
      cleanOrderWa.endsWith(targetPhone.slice(-10))
    );
  });
}

export function createOrder(newOrder: BakeryOrder): BakeryOrder {
  const orders = getOrders();
  const updated = [newOrder, ...orders];
  storage.set(ORDERS_STORAGE_KEY, updated);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): BakeryOrder | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return null;

  const current = orders[idx];
  const historyEntry = {
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`
  };

  const updated: BakeryOrder = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
    statusHistory: [...(current.statusHistory || []), historyEntry]
  };

  orders[idx] = updated;
  storage.set(ORDERS_STORAGE_KEY, orders);
  return updated;
}

export function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): BakeryOrder | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return null;

  const updated: BakeryOrder = {
    ...orders[idx],
    paymentStatus,
    updatedAt: new Date().toISOString()
  };

  orders[idx] = updated;
  storage.set(ORDERS_STORAGE_KEY, orders);
  return updated;
}

export function deleteOrder(orderId: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.orderId !== orderId);
  storage.set(ORDERS_STORAGE_KEY, filtered);
  return true;
}

/**
 * Builds the exact structured WhatsApp order confirmation message
 */
export function generateWhatsAppOrderMessage(order: BakeryOrder, config: BakeryConfig): string {
  const c = order.customer;
  const itemsText = order.items
    .map((item, idx) => {
      const prefix = order.items.length > 1 ? `[Item #${idx + 1}]\n` : '';
      return `${prefix}Cake: ${item.cakeName}
Size: ${item.size}
Flavour: ${item.flavour}
Egg/Eggless: ${item.isEggless ? '100% Eggless' : 'Contains Egg'}
Quantity: ${item.quantity}
Cake Message: ${item.cakeMessage ? `"${item.cakeMessage}"` : 'None'}
Special Instructions: ${item.specialInstructions || 'None'}`;
    })
    .join('\n\n');

  const lines = [
    `*NEW CAKE ORDER - ${order.orderId}*`,
    `🎂 *${config.businessName}*`,
    '',
    `*Customer Name:* ${c.fullName}`,
    `*Phone:* ${c.mobileNumber}`,
    `*Address:* ${c.deliveryAddress}, ${c.landmark ? `${c.landmark}, ` : ''}${c.city} - ${c.pincode}`,
    '',
    itemsText,
    '',
    `*Delivery Date:* ${order.deliveryDate}`,
    `*Delivery Time:* ${order.deliveryTimeSlot}`,
    order.specialInstructions ? `*Order Notes:* ${order.specialInstructions}` : '',
    '',
    `*Subtotal:* ${config.currency}${order.subtotal}`,
    `*Delivery:* ${order.deliveryCharge === 0 ? 'FREE' : `${config.currency}${order.deliveryCharge}`}`,
    order.discount > 0 ? `*Discount (${order.couponCode || 'Promo'}):* -${config.currency}${order.discount}` : '',
    `*Total:* ${config.currency}${order.grandTotal}`,
    `*Payment Method:* ${order.paymentMethod}`,
    `*Payment Status:* ${order.paymentStatus}`,
    '',
    'Please confirm my cake order and delivery schedule. Thank you!'
  ].filter(Boolean);

  return lines.join('\n');
}

export function getWhatsAppOrderUrl(order: BakeryOrder, config: BakeryConfig): string {
  const message = generateWhatsAppOrderMessage(order, config);
  const cleanPhone = config.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Custom Cake Inquiries
export function getCustomCakeInquiries(): CustomCakeInquiry[] {
  return storage.get<CustomCakeInquiry[]>(INQUIRIES_STORAGE_KEY, []);
}

export function saveCustomCakeInquiry(inquiry: CustomCakeInquiry): CustomCakeInquiry {
  const current = getCustomCakeInquiries();
  const updated = [inquiry, ...current];
  storage.set(INQUIRIES_STORAGE_KEY, updated);
  return inquiry;
}

export function generateWhatsAppCustomCakeMessage(inquiry: CustomCakeInquiry, config: BakeryConfig): string {
  const lines = [
    `*CUSTOM CAKE INQUIRY - #${inquiry.id}*`,
    `🎂 *${config.businessName}*`,
    '',
    `*Customer Name:* ${inquiry.customerName}`,
    `*Phone:* ${inquiry.phone}`,
    `*Cake Type:* ${inquiry.cakeType}`,
    `*Estimated Weight:* ${inquiry.weight}`,
    `*Flavour Preference:* ${inquiry.flavour}`,
    `*Dietary:* ${inquiry.isEggless ? '100% Eggless' : 'Regular (With Egg)'}`,
    `*Theme / Style:* ${inquiry.theme}`,
    `*Message on Cake:* ${inquiry.cakeMessage || 'To be decided'}`,
    `*Delivery Date:* ${inquiry.deliveryDate}`,
    `*Delivery Time:* ${inquiry.deliveryTime}`,
    `*Budget Range:* ${inquiry.budgetRange}`,
    `*Special Instructions:* ${inquiry.specialInstructions || 'None'}`,
    inquiry.referenceImageName ? `*Reference Image Attached in Form:* Yes (${inquiry.referenceImageName})` : '',
    '',
    'Hi, I would like a price quote and design consultation for this custom cake!'
  ].filter(Boolean);

  return lines.join('\n');
}

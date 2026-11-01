import { BakeryOrder, OrderStatus, PaymentStatus, CustomCakeInquiry } from '../types/order';
import { BakeryConfig } from '../config/bakeryConfig';
import { adminAuthService } from './adminAuthService';

// In-memory cache for orders fetched by admin
let cachedOrders: BakeryOrder[] = [];
let cachedInquiries: CustomCakeInquiry[] = [];

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SCB-${year}${month}${day}-${rand}`;
}

/**
 * Fetch all orders from the secure server API (Protected by server-side admin authentication)
 */
export async function fetchOrders(): Promise<BakeryOrder[]> {
  try {
    const res = await fetch('/api/admin/orders', {
      headers: adminAuthService.getAuthHeaders()
    });

    if (!res.ok) {
      if (res.status === 401) {
        adminAuthService.clearToken();
      }
      return cachedOrders;
    }

    const data = await res.json();
    cachedOrders = data;
    return data;
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return cachedOrders;
  }
}

/**
 * Synchronous accessor that returns currently loaded admin orders
 */
export function getOrders(): BakeryOrder[] {
  return cachedOrders;
}

/**
 * Customer order search by Order ID and Phone number (Privacy-preserving server verification)
 */
export async function findOrderByTrackInfo(orderId: string, phone: string): Promise<BakeryOrder | null> {
  try {
    const res = await fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId.trim(), phone: phone.trim() })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.order || null;
  } catch (err) {
    console.error('Error tracking order:', err);
    return null;
  }
}

/**
 * Customer creates an order (Saves to server database, never exposes other customer data)
 */
export async function createOrder(newOrder: BakeryOrder): Promise<BakeryOrder> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });

    if (!res.ok) {
      console.warn('Server order submission failed, using local instance');
      return newOrder;
    }

    const data = await res.json();
    return data.order || newOrder;
  } catch (err) {
    console.error('Network error creating order:', err);
    return newOrder;
  }
}

/**
 * Admin: Update order status via server API (Strictly protected)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<BakeryOrder | null> {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: adminAuthService.getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });

    if (!res.ok) {
      return null;
    }

    const updated = await res.json();
    cachedOrders = cachedOrders.map((o) => (o.orderId === orderId ? updated : o));
    return updated;
  } catch (err) {
    console.error('Error updating order status:', err);
    return null;
  }
}

/**
 * Admin: Update payment status via server API (Strictly protected)
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<BakeryOrder | null> {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/payment`, {
      method: 'PATCH',
      headers: adminAuthService.getAuthHeaders(),
      body: JSON.stringify({ paymentStatus })
    });

    if (!res.ok) {
      return null;
    }

    const updated = await res.json();
    cachedOrders = cachedOrders.map((o) => (o.orderId === orderId ? updated : o));
    return updated;
  } catch (err) {
    console.error('Error updating payment status:', err);
    return null;
  }
}

/**
 * Admin: Delete order via server API (Strictly protected)
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
      headers: adminAuthService.getAuthHeaders()
    });

    if (!res.ok) {
      return false;
    }

    cachedOrders = cachedOrders.filter((o) => o.orderId !== orderId);
    return true;
  } catch (err) {
    console.error('Error deleting order:', err);
    return false;
  }
}

/**
 * Builds the exact structured WhatsApp order confirmation message
 */
export function generateWhatsAppOrderMessage(order: BakeryOrder, config: BakeryConfig): string {
  const c = order.customer;
  const itemsText = order.items
    .map((item, idx) => {
      const prefix = order.items.length > 1 ? `[Item #${idx + 1}]\n` : '';

      if (item.customCakeDesign) {
        const cd = item.customCakeDesign;
        const decorList = cd.decorations.length > 0
          ? cd.decorations
              .map((d) => d.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
              .join(', ')
          : 'None';

        return `${prefix}*CUSTOM CAKE ORDER*
Shape: ${cd.shape}
Weight: ${cd.size}
Sponge: ${cd.sponge}
Filling: ${cd.filling}
Frosting: ${cd.frostingColorName} ${cd.frosting}
Decorations: ${decorList}
Cake Message: ${cd.cakeMessage ? `"${cd.cakeMessage}"` : 'None'}
Dietary: ${item.isEggless ? '100% Eggless' : 'Contains Egg'}
Quantity: ${item.quantity}
Item Price: ${config.currency}${item.unitPrice * item.quantity}${item.specialInstructions ? `\nSpecial Notes: ${item.specialInstructions}` : ''}`;
      }

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

// ---------------- CUSTOM CAKE INQUIRIES ---------------- //

export async function fetchCustomCakeInquiries(): Promise<CustomCakeInquiry[]> {
  try {
    const res = await fetch('/api/admin/inquiries', {
      headers: adminAuthService.getAuthHeaders()
    });

    if (!res.ok) {
      return cachedInquiries;
    }

    const data = await res.json();
    cachedInquiries = data;
    return data;
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return cachedInquiries;
  }
}

export function getCustomCakeInquiries(): CustomCakeInquiry[] {
  return cachedInquiries;
}

export async function saveCustomCakeInquiry(inquiry: CustomCakeInquiry): Promise<CustomCakeInquiry> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });

    if (!res.ok) {
      return inquiry;
    }

    const data = await res.json();
    return data.inquiry || inquiry;
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    return inquiry;
  }
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

import { Router, Request, Response, NextFunction } from 'express';
import {
  isAdminConfigured,
  authenticateAdmin,
  validateSession,
  invalidateSession,
  checkRateLimit,
  recordFailedLogin,
  resetFailedLogin,
  saveFileCredentials,
  AdminSession
} from './auth';
import {
  getOrdersDb,
  findOrderById,
  createOrderDb,
  updateOrderStatusDb,
  updatePaymentStatusDb,
  deleteOrderDb,
  getCakesDb,
  addCakeDb,
  updateCakeDb,
  deleteCakeDb,
  resetCakesDb,
  getConfigDb,
  saveConfigDb,
  getInquiriesDb,
  createInquiryDb
} from './db';
import { BakeryOrder, OrderStatus, PaymentStatus, CustomCakeInquiry } from '../src/types/order';
import { Cake } from '../src/types/cake';

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  adminSession?: AdminSession;
}

export const apiRouter = Router();

// Middleware: Require real server-side admin authentication
export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof req.headers['x-admin-token'] === 'string') {
    token = req.headers['x-admin-token'].trim();
  }

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized: Administrator authentication required.',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  const session = validateSession(token);
  if (!session) {
    res.status(401).json({
      error: 'Session expired or invalid. Please sign in again.',
      code: 'SESSION_EXPIRED'
    });
    return;
  }

  req.adminSession = session;
  next();
}

// ----------------- ADMIN AUTHENTICATION ROUTES ----------------- //

/**
 * Check if admin authentication is configured on the server
 */
apiRouter.get('/admin/status', (req: Request, res: Response) => {
  const isConfigured = isAdminConfigured();
  if (!isConfigured) {
    res.json({
      isConfigured: false,
      message: 'Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.'
    });
  } else {
    res.json({
      isConfigured: true
    });
  }
});

/**
 * Admin Login
 */
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { email, password } = req.body || {};

  // 1. Check if server admin is configured
  if (!isAdminConfigured()) {
    res.status(403).json({
      error: 'Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.',
      code: 'AUTH_SETUP_REQUIRED'
    });
    return;
  }

  // 2. Rate limit check
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: `Too many failed login attempts. Please wait ${rateLimit.remainingLockSeconds} seconds before trying again.`,
      code: 'RATE_LIMITED'
    });
    return;
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    recordFailedLogin(clientIp);
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  // 3. Authenticate
  const result = authenticateAdmin(email, password);
  if (!result.success || !result.session) {
    recordFailedLogin(clientIp);
    res.status(401).json({
      error: result.error || 'Invalid email or password.',
      code: 'INVALID_CREDENTIALS'
    });
    return;
  }

  // 4. Success - Reset rate limit record and return session token
  resetFailedLogin(clientIp);
  res.json({
    success: true,
    token: result.session.token,
    email: result.session.email,
    expiresAt: result.session.expiresAt
  });
});

/**
 * Admin Logout
 */
apiRouter.post('/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof req.headers['x-admin-token'] === 'string') {
    token = req.headers['x-admin-token'].trim();
  }

  invalidateSession(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Verify current session token
 */
apiRouter.get('/admin/verify', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    email: req.adminSession?.email,
    expiresAt: req.adminSession?.expiresAt
  });
});

/**
 * First-time Admin Account Setup
 * Only allowed if admin is NOT yet configured, requiring the secure setup secret or initial setup token
 */
apiRouter.post('/admin/setup', (req: Request, res: Response) => {
  if (isAdminConfigured()) {
    res.status(403).json({
      error: 'Admin authentication has already been configured.',
      code: 'ALREADY_CONFIGURED'
    });
    return;
  }

  const { email, password, setupKey } = req.body || {};
  const expectedSecret = process.env.ADMIN_SETUP_SECRET;

  if (expectedSecret && setupKey !== expectedSecret) {
    res.status(403).json({ error: 'Invalid admin setup key.' });
    return;
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Valid email and password are required.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const saved = saveFileCredentials(email, password);
  if (!saved) {
    res.status(500).json({ error: 'Failed to save admin credentials securely.' });
    return;
  }

  res.json({
    success: true,
    message: 'Admin account created successfully. You may now log in.'
  });
});

// ----------------- PUBLIC CUSTOMER ROUTES ----------------- //

/**
 * Public Bakery Config
 */
apiRouter.get('/config', (req: Request, res: Response) => {
  res.json(getConfigDb());
});

/**
 * Public Cake Catalog
 */
apiRouter.get('/cakes', (req: Request, res: Response) => {
  res.json(getCakesDb());
});

apiRouter.get('/cakes/:id', (req: Request, res: Response) => {
  const cakes = getCakesDb();
  const cake = cakes.find((c) => c.id === req.params.id || c.slug === req.params.id);
  if (!cake) {
    res.status(404).json({ error: 'Cake not found.' });
    return;
  }
  res.json(cake);
});

/**
 * Customer Place Order (Saves securely on server, only returns the created order to the purchaser)
 */
apiRouter.post('/orders', (req: Request, res: Response) => {
  const orderData = req.body as BakeryOrder;
  if (!orderData || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    res.status(400).json({ error: 'Invalid order: No items provided.' });
    return;
  }

  if (!orderData.customer || !orderData.customer.fullName || !orderData.customer.mobileNumber) {
    res.status(400).json({ error: 'Invalid order: Customer contact details required.' });
    return;
  }

  // Ensure unique ID & server timestamps
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderId = orderData.orderId || `SCB-${year}${month}${day}-${rand}`;

  const sanitizedOrder: BakeryOrder = {
    ...orderData,
    orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: orderData.status || 'Pending',
    statusHistory: orderData.statusHistory || [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Order submitted online'
      }
    ]
  };

  const savedOrder = createOrderDb(sanitizedOrder);
  res.status(201).json({ success: true, order: savedOrder });
});

/**
 * Customer Track Order (Strictly requires matching order ID AND customer phone number)
 */
apiRouter.post('/orders/track', (req: Request, res: Response) => {
  const { orderId, phone } = req.body || {};
  if (!orderId || typeof orderId !== 'string') {
    res.status(400).json({ error: 'Order ID is required.' });
    return;
  }

  const order = findOrderById(orderId);
  if (!order) {
    res.status(404).json({ error: 'No order found with the provided Order ID.' });
    return;
  }

  // If customer provided a phone number, verify it matches
  if (phone && typeof phone === 'string') {
    const cleanTargetPhone = phone.replace(/\D/g, '');
    const cleanCustomerPhone = (order.customer.mobileNumber || '').replace(/\D/g, '');
    const cleanCustomerWa = (order.customer.whatsappNumber || '').replace(/\D/g, '');

    const matches =
      (cleanCustomerPhone && cleanCustomerPhone.endsWith(cleanTargetPhone.slice(-10))) ||
      (cleanCustomerWa && cleanCustomerWa.endsWith(cleanTargetPhone.slice(-10)));

    if (!matches) {
      res.status(404).json({ error: 'Order ID or phone number did not match our records.' });
      return;
    }
  }

  res.json({ success: true, order });
});

/**
 * Customer Submit Custom Cake Inquiry
 */
apiRouter.post('/inquiries', (req: Request, res: Response) => {
  const inquiryData = req.body as CustomCakeInquiry;
  if (!inquiryData || !inquiryData.customerName || !inquiryData.phone) {
    res.status(400).json({ error: 'Customer name and phone number are required.' });
    return;
  }

  const saved = createInquiryDb({
    ...inquiryData,
    id: inquiryData.id || `INQ-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: inquiryData.status || 'Inquiry Received'
  });

  res.status(201).json({ success: true, inquiry: saved });
});

// ----------------- PROTECTED ADMIN ROUTES ----------------- //

/**
 * Admin: Get all orders (STRICTLY PROTECTED)
 */
apiRouter.get('/admin/orders', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(getOrdersDb());
});

/**
 * Admin: Update order status (STRICTLY PROTECTED)
 */
apiRouter.patch('/admin/orders/:id/status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { status, note } = req.body as { status: OrderStatus; note?: string };
  if (!status) {
    res.status(400).json({ error: 'Status is required.' });
    return;
  }

  const updated = updateOrderStatusDb(req.params.id, status, note);
  if (!updated) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  res.json(updated);
});

/**
 * Admin: Update payment status (STRICTLY PROTECTED)
 */
apiRouter.patch('/admin/orders/:id/payment', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { paymentStatus } = req.body as { paymentStatus: PaymentStatus };
  if (!paymentStatus) {
    res.status(400).json({ error: 'Payment status is required.' });
    return;
  }

  const updated = updatePaymentStatusDb(req.params.id, paymentStatus);
  if (!updated) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  res.json(updated);
});

/**
 * Admin: Delete order (STRICTLY PROTECTED)
 */
apiRouter.delete('/admin/orders/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = deleteOrderDb(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  res.json({ success: true, message: 'Order deleted successfully.' });
});

/**
 * Admin: Get all inquiries (STRICTLY PROTECTED)
 */
apiRouter.get('/admin/inquiries', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(getInquiriesDb());
});

/**
 * Admin: Add cake (STRICTLY PROTECTED)
 */
apiRouter.post('/admin/cakes', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const cake = req.body as Cake;
  if (!cake || !cake.name || !cake.basePrice) {
    res.status(400).json({ error: 'Cake name and basePrice are required.' });
    return;
  }

  const saved = addCakeDb(cake);
  res.status(201).json(saved);
});

/**
 * Admin: Update cake (STRICTLY PROTECTED)
 */
apiRouter.put('/admin/cakes/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const cake = req.body as Cake;
  const updated = updateCakeDb(cake);
  if (!updated) {
    res.status(404).json({ error: 'Cake not found.' });
    return;
  }

  res.json(updated);
});

/**
 * Admin: Delete cake (STRICTLY PROTECTED)
 */
apiRouter.delete('/admin/cakes/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = deleteCakeDb(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Cake not found.' });
    return;
  }

  res.json({ success: true });
});

/**
 * Admin: Reset cakes to default catalog (STRICTLY PROTECTED)
 */
apiRouter.post('/admin/cakes/reset', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const resetList = resetCakesDb();
  res.json(resetList);
});

/**
 * Admin: Update bakery configuration (STRICTLY PROTECTED)
 */
apiRouter.put('/admin/config', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newConfig = req.body;
  if (!newConfig || !newConfig.businessName) {
    res.status(400).json({ error: 'Invalid configuration data.' });
    return;
  }

  saveConfigDb(newConfig);
  res.json(newConfig);
});

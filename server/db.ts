import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BakeryOrder, OrderStatus, PaymentStatus, CustomCakeInquiry } from '../src/types/order';
import { Cake } from '../src/types/cake';
import { BakeryConfig, defaultBakeryConfig } from '../src/config/bakeryConfig';
import { SAMPLE_CAKES } from '../src/data/sampleCakes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CAKES_FILE = path.join(DATA_DIR, 'cakes.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filePath, fallback);
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// ---------------- ORDERS ---------------- //
export function getOrdersDb(): BakeryOrder[] {
  return readJsonFile<BakeryOrder[]>(ORDERS_FILE, []);
}

export function saveOrdersDb(orders: BakeryOrder[]): void {
  writeJsonFile(ORDERS_FILE, orders);
}

export function findOrderById(orderId: string): BakeryOrder | undefined {
  const orders = getOrdersDb();
  const target = orderId.trim().toUpperCase();
  return orders.find((o) => o.orderId.toUpperCase() === target);
}

export function createOrderDb(order: BakeryOrder): BakeryOrder {
  const orders = getOrdersDb();
  orders.unshift(order);
  saveOrdersDb(orders);
  return order;
}

export function updateOrderStatusDb(orderId: string, status: OrderStatus, note?: string): BakeryOrder | null {
  const orders = getOrdersDb();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const current = orders[index];
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

  orders[index] = updated;
  saveOrdersDb(orders);
  return updated;
}

export function updatePaymentStatusDb(orderId: string, paymentStatus: PaymentStatus): BakeryOrder | null {
  const orders = getOrdersDb();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const updated: BakeryOrder = {
    ...orders[index],
    paymentStatus,
    updatedAt: new Date().toISOString()
  };

  orders[index] = updated;
  saveOrdersDb(orders);
  return updated;
}

export function deleteOrderDb(orderId: string): boolean {
  const orders = getOrdersDb();
  const filtered = orders.filter((o) => o.orderId !== orderId);
  if (filtered.length === orders.length) return false;
  saveOrdersDb(filtered);
  return true;
}

// ---------------- CAKES ---------------- //
export function getCakesDb(): Cake[] {
  return readJsonFile<Cake[]>(CAKES_FILE, SAMPLE_CAKES);
}

export function saveCakesDb(cakes: Cake[]): void {
  writeJsonFile(CAKES_FILE, cakes);
}

export function addCakeDb(cake: Cake): Cake {
  const cakes = getCakesDb();
  cakes.unshift(cake);
  saveCakesDb(cakes);
  return cake;
}

export function updateCakeDb(updatedCake: Cake): Cake | null {
  const cakes = getCakesDb();
  const index = cakes.findIndex((c) => c.id === updatedCake.id);
  if (index === -1) return null;
  cakes[index] = updatedCake;
  saveCakesDb(cakes);
  return updatedCake;
}

export function deleteCakeDb(id: string): boolean {
  const cakes = getCakesDb();
  const filtered = cakes.filter((c) => c.id !== id);
  if (filtered.length === cakes.length) return false;
  saveCakesDb(filtered);
  return true;
}

export function resetCakesDb(): Cake[] {
  saveCakesDb(SAMPLE_CAKES);
  return SAMPLE_CAKES;
}

// ---------------- CONFIG ---------------- //
export function getConfigDb(): BakeryConfig {
  return readJsonFile<BakeryConfig>(CONFIG_FILE, defaultBakeryConfig);
}

export function saveConfigDb(config: BakeryConfig): void {
  writeJsonFile(CONFIG_FILE, config);
}

// ---------------- CUSTOM INQUIRIES ---------------- //
export function getInquiriesDb(): CustomCakeInquiry[] {
  return readJsonFile<CustomCakeInquiry[]>(INQUIRIES_FILE, []);
}

export function createInquiryDb(inquiry: CustomCakeInquiry): CustomCakeInquiry {
  const list = getInquiriesDb();
  list.unshift(inquiry);
  writeJsonFile(INQUIRIES_FILE, list);
  return inquiry;
}

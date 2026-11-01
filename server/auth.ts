import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const CREDENTIALS_FILE = path.join(DATA_DIR, '.admin-credentials.json');

// In-memory active session store: token -> session info
export interface AdminSession {
  token: string;
  email: string;
  role: 'admin';
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, AdminSession>();

// Rate limiting for login attempts
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface StoredAdminCredentials {
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hash password using crypto.scryptSync with high security parameters
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Secure constant-time comparison
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computedHash = hashPassword(password, salt);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Read stored file credentials if exists
 */
function getFileCredentials(): StoredAdminCredentials | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin credentials file:', err);
  }
  return null;
}

/**
 * Save credentials to secure server-side file
 */
export function saveFileCredentials(email: string, password: string): boolean {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const creds: StoredAdminCredentials = {
      email: email.trim().toLowerCase(),
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 });
    return true;
  } catch (err) {
    console.error('Error saving admin credentials:', err);
    return false;
  }
}

/**
 * Checks whether administrator authentication is configured on the server
 */
export function isAdminConfigured(): boolean {
  // 1. Check environment variables
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (envEmail && envPassword) {
    return true;
  }

  // 2. Check credentials file
  const fileCreds = getFileCredentials();
  if (fileCreds && fileCreds.email && fileCreds.passwordHash && fileCreds.salt) {
    return true;
  }

  return false;
}

/**
 * Rate limiter check
 */
export function checkRateLimit(clientKey: string): { allowed: boolean; remainingLockSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(clientKey);

  if (record && record.lockedUntil > now) {
    const remainingLockSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockSeconds };
  }

  return { allowed: true };
}

export function recordFailedLogin(clientKey: string): void {
  const now = Date.now();
  const record = loginAttempts.get(clientKey) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    record.attempts = 0; // reset counter after locking
  }

  loginAttempts.set(clientKey, record);
}

export function resetFailedLogin(clientKey: string): void {
  loginAttempts.delete(clientKey);
}

/**
 * Authenticates admin credentials securely
 */
export function authenticateAdmin(emailInput: string, passwordInput: string): { success: boolean; session?: AdminSession; error?: string } {
  if (!isAdminConfigured()) {
    return {
      success: false,
      error: 'Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.'
    };
  }

  const normalizedInputEmail = emailInput.trim().toLowerCase();
  let isAuthenticated = false;
  let adminEmail = normalizedInputEmail;

  // 1. Check against Environment variables if present
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (envEmail && envPassword && normalizedInputEmail === envEmail) {
    // Constant-time check using crypto.timingSafeEqual
    const salt = process.env.SESSION_SECRET || 'sweet-crumbs-bakery-secret-salt';
    const computedHash = hashPassword(passwordInput, salt);
    const targetHash = hashPassword(envPassword, salt);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(targetHash, 'hex');
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      isAuthenticated = true;
      adminEmail = envEmail;
    }
  }

  // 2. Check against stored credentials file if not authenticated yet
  if (!isAuthenticated) {
    const fileCreds = getFileCredentials();
    if (fileCreds && fileCreds.email === normalizedInputEmail) {
      if (verifyPassword(passwordInput, fileCreds.salt, fileCreds.passwordHash)) {
        isAuthenticated = true;
        adminEmail = fileCreds.email;
      }
    }
  }

  if (!isAuthenticated) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Create cryptographically secure random session token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    email: adminEmail,
    role: 'admin',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  };

  activeSessions.set(token, session);
  return { success: true, session };
}

/**
 * Validates a session token
 */
export function validateSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

/**
 * Invalidate a session (logout)
 */
export function invalidateSession(token: string | undefined): boolean {
  if (!token) return false;
  return activeSessions.delete(token);
}

/**
 * Cleanup expired sessions periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 60 * 1000).unref();

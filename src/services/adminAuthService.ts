/**
 * Admin Authentication Service
 * 
 * Secure client-side bridge communicating with the server authentication endpoints.
 * Never stores or exposes raw passwords or demo credentials.
 */

const TOKEN_KEY = 'sweetcrumbs_admin_token';

export interface AdminStatusResponse {
  isConfigured: boolean;
  message?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  email?: string;
  expiresAt?: number;
  error?: string;
}

export const adminAuthService = {
  /**
   * Retrieves active session token from sessionStorage (cleared on tab close)
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Saves active session token in sessionStorage
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Clears active session token
   */
  clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Returns authorization headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  /**
   * Checks if admin authentication has been configured on the server
   */
  async checkStatus(): Promise<AdminStatusResponse> {
    try {
      const res = await fetch('/api/admin/status');
      if (!res.ok) {
        return { isConfigured: false, message: 'Server communication error.' };
      }
      return await res.json();
    } catch {
      return {
        isConfigured: false,
        message: 'Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.'
      };
    }
  },

  /**
   * Signs in admin with credentials verified on the server
   */
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please verify credentials.'
        };
      }

      if (data.token) {
        this.setToken(data.token);
        return {
          success: true,
          token: data.token,
          email: data.email,
          expiresAt: data.expiresAt
        };
      }

      return { success: false, error: 'Invalid response from authentication server.' };
    } catch {
      return {
        success: false,
        error: 'Unable to reach authentication server. Please check connection.'
      };
    }
  },

  /**
   * Verifies existing session with the server
   */
  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/admin/verify', {
        headers: this.getAuthHeaders()
      });

      if (!res.ok) {
        this.clearToken();
        return false;
      }

      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  },

  /**
   * Logs out admin on the server and clears local token
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: this.getAuthHeaders()
        });
      }
    } catch (err) {
      console.warn('Logout network error:', err);
    } finally {
      this.clearToken();
    }
  }
};

/**
 * Resilient localStorage helper with try/catch
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading key "${key}" from localStorage:`, e);
      return fallback;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving key "${key}" to localStorage:`, e);
      return false;
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing key "${key}" from localStorage:`, e);
    }
  }
};

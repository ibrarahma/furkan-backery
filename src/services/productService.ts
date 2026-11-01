import { Cake } from '../types/cake';
import { SAMPLE_CAKES } from '../data/sampleCakes';
import { adminAuthService } from './adminAuthService';

let cachedCakes: Cake[] = SAMPLE_CAKES;

export async function fetchCakes(): Promise<Cake[]> {
  try {
    const res = await fetch('/api/cakes');
    if (!res.ok) {
      return cachedCakes;
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      cachedCakes = data;
    }
    return cachedCakes;
  } catch (err) {
    console.error('Error fetching cakes catalog:', err);
    return cachedCakes;
  }
}

export function getCakes(): Cake[] {
  return cachedCakes;
}

export function getCakeById(id: string): Cake | undefined {
  return cachedCakes.find((c) => c.id === id);
}

export function getCakeBySlug(slug: string): Cake | undefined {
  return cachedCakes.find((c) => c.slug === slug || c.id === slug);
}

// ----------------- PROTECTED ADMIN ACTIONS ----------------- //

export async function addCake(cake: Cake): Promise<Cake> {
  try {
    const res = await fetch('/api/admin/cakes', {
      method: 'POST',
      headers: adminAuthService.getAuthHeaders(),
      body: JSON.stringify(cake)
    });

    if (!res.ok) {
      throw new Error('Failed to create cake on server');
    }

    const saved = await res.json();
    cachedCakes = [saved, ...cachedCakes];
    return saved;
  } catch (err) {
    console.error('Error adding cake:', err);
    cachedCakes = [cake, ...cachedCakes];
    return cake;
  }
}

export async function updateCake(updatedCake: Cake): Promise<Cake> {
  try {
    const res = await fetch(`/api/admin/cakes/${encodeURIComponent(updatedCake.id)}`, {
      method: 'PUT',
      headers: adminAuthService.getAuthHeaders(),
      body: JSON.stringify(updatedCake)
    });

    if (!res.ok) {
      throw new Error('Failed to update cake on server');
    }

    const saved = await res.json();
    cachedCakes = cachedCakes.map((c) => (c.id === saved.id ? saved : c));
    return saved;
  } catch (err) {
    console.error('Error updating cake:', err);
    cachedCakes = cachedCakes.map((c) => (c.id === updatedCake.id ? updatedCake : c));
    return updatedCake;
  }
}

export async function deleteCake(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/cakes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminAuthService.getAuthHeaders()
    });

    if (!res.ok) {
      return false;
    }

    cachedCakes = cachedCakes.filter((c) => c.id !== id);
    return true;
  } catch (err) {
    console.error('Error deleting cake:', err);
    cachedCakes = cachedCakes.filter((c) => c.id !== id);
    return true;
  }
}

export async function resetToDefaultCakes(): Promise<Cake[]> {
  try {
    const res = await fetch('/api/admin/cakes/reset', {
      method: 'POST',
      headers: adminAuthService.getAuthHeaders()
    });

    if (!res.ok) {
      return cachedCakes;
    }

    const resetList = await res.json();
    cachedCakes = resetList;
    return resetList;
  } catch (err) {
    console.error('Error resetting cakes:', err);
    cachedCakes = SAMPLE_CAKES;
    return SAMPLE_CAKES;
  }
}

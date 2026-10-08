import { Cake } from '../types/cake';
import { SAMPLE_CAKES } from '../data/sampleCakes';
import { storage } from './storage';

const CAKES_STORAGE_KEY = 'sweetcrumbs_cakes_catalog_v1';

export function getCakes(): Cake[] {
  const cached = storage.get<Cake[] | null>(CAKES_STORAGE_KEY, null);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }
  // Initial seed
  storage.set(CAKES_STORAGE_KEY, SAMPLE_CAKES);
  return SAMPLE_CAKES;
}

export function getCakeById(id: string): Cake | undefined {
  const all = getCakes();
  return all.find((c) => c.id === id);
}

export function getCakeBySlug(slug: string): Cake | undefined {
  const all = getCakes();
  return all.find((c) => c.slug === slug || c.id === slug);
}

export function saveAllCakes(cakes: Cake[]): void {
  storage.set(CAKES_STORAGE_KEY, cakes);
}

export function addCake(cake: Cake): Cake {
  const all = getCakes();
  const updated = [cake, ...all];
  saveAllCakes(updated);
  return cake;
}

export function updateCake(updatedCake: Cake): Cake {
  const all = getCakes();
  const updated = all.map((c) => (c.id === updatedCake.id ? updatedCake : c));
  saveAllCakes(updated);
  return updatedCake;
}

export function deleteCake(id: string): boolean {
  const all = getCakes();
  const filtered = all.filter((c) => c.id !== id);
  saveAllCakes(filtered);
  return true;
}

export function resetToDefaultCakes(): Cake[] {
  storage.set(CAKES_STORAGE_KEY, SAMPLE_CAKES);
  return SAMPLE_CAKES;
}

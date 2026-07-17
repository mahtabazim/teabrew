"use client";

import { useSyncExternalStore } from "react";
import type { Shop } from "@/lib/shops";

const STORAGE_KEY = "teabrew:saved:v1";

export type SavedState = {
  shops: Shop[];
  recipes: string[];
};

const EMPTY: SavedState = { shops: [], recipes: [] };

// The snapshot must be referentially stable between renders or
// useSyncExternalStore loops forever, so state is only ever replaced on write.
let state: SavedState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or a full quota; the in-memory state still works.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
// The server has no localStorage, so first client render must match this.
const getServerSnapshot = () => EMPTY;

/** Reads localStorage once, after mount, to avoid a hydration mismatch. */
export function hydrateSaved() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    state = {
      shops: Array.isArray(parsed.shops) ? parsed.shops : [],
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : [],
    };
    emit();
  } catch {
    // Corrupt payload; fall back to an empty shelf rather than crashing.
  }
}

export function useSaved(): SavedState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleShop(shop: Shop) {
  const exists = state.shops.some((saved) => saved.id === shop.id);
  state = {
    ...state,
    shops: exists
      ? state.shops.filter((saved) => saved.id !== shop.id)
      : [...state.shops, shop],
  };
  persist();
  emit();
}

export function toggleRecipe(slug: string) {
  const exists = state.recipes.includes(slug);
  state = {
    ...state,
    recipes: exists
      ? state.recipes.filter((saved) => saved !== slug)
      : [...state.recipes, slug],
  };
  persist();
  emit();
}

export function clearSaved() {
  state = EMPTY;
  persist();
  emit();
}

import { create } from 'zustand';
import type { Catalog, SelectionState } from './types';
import { variantKey } from './types';
import { loadSelection, saveSelection } from './persistence';
import bundledCatalog from '../data/catalog.json';

type Status = 'loading' | 'ready' | 'error';

interface BundleStore {
  catalog: Catalog | null;
  status: Status;
  selection: SelectionState;
  savedAt: number | null;

  init: () => Promise<void>;
  changeQty: (productId: string, variantId: string, delta: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  selectPlan: (planId: string | null) => void;
  toggleStep: (stepId: string) => void;
  goToNextStep: (currentStepId: string) => void;
  saveForLater: () => boolean;
}

async function fetchCatalog(): Promise<Catalog> {
  try {
    const res = await fetch('/api/catalog');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Catalog;
  } catch {
    return bundledCatalog as unknown as Catalog;
  }
}

function withQty(
  selection: SelectionState,
  productId: string,
  variantId: string,
  qty: number,
): SelectionState {
  const key = variantKey(productId, variantId);
  const quantities = { ...selection.quantities };
  if (qty <= 0) delete quantities[key];
  else quantities[key] = qty;
  return { ...selection, quantities };
}

export const useBundle = create<BundleStore>((set, get) => ({
  catalog: null,
  status: 'loading',
  selection: {
    quantities: {},
    activeVariant: {},
    selectedPlanId: null,
    openStepId: 'cameras',
  },
  savedAt: null,

  init: async () => {
    const catalog = await fetchCatalog();
    const selection = loadSelection() ?? catalog.seed;
    set({ catalog, selection, status: 'ready' });
  },

  changeQty: (productId, variantId, delta) => {
    const { selection } = get();
    const current = selection.quantities[variantKey(productId, variantId)] ?? 0;
    set({
      selection: withQty(selection, productId, variantId, current + delta),
      savedAt: null,
    });
  },

  setQty: (productId, variantId, qty) => {
    set({
      selection: withQty(get().selection, productId, variantId, qty),
      savedAt: null,
    });
  },

  setActiveVariant: (productId, variantId) => {
    const { selection } = get();
    set({
      selection: {
        ...selection,
        activeVariant: { ...selection.activeVariant, [productId]: variantId },
      },
      savedAt: null,
    });
  },

  selectPlan: (planId) => {
    set({ selection: { ...get().selection, selectedPlanId: planId }, savedAt: null });
  },

  toggleStep: (stepId) => {
    const { selection } = get();
    set({
      selection: {
        ...selection,
        openStepId: selection.openStepId === stepId ? '' : stepId,
      },
    });
  },

  goToNextStep: (currentStepId) => {
    const { catalog, selection } = get();
    if (!catalog) return;
    const idx = catalog.steps.findIndex((s) => s.id === currentStepId);
    const next = catalog.steps[idx + 1];
    if (next) set({ selection: { ...selection, openStepId: next.id } });
  },

  saveForLater: () => {
    const ok = saveSelection(get().selection);
    if (ok) set({ savedAt: Date.now() });
    return ok;
  },
}));

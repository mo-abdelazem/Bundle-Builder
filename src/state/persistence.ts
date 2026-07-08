import type { SelectionState } from './types';

const STORAGE_KEY = 'bundle-builder:selection:v1';

export function saveSelection(state: SelectionState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadSelection(): SelectionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectionState>;
    if (!parsed || typeof parsed !== 'object' || !parsed.quantities) return null;
    return {
      quantities: parsed.quantities ?? {},
      activeVariant: parsed.activeVariant ?? {},
      selectedPlanId: parsed.selectedPlanId ?? null,
      openStepId: parsed.openStepId ?? 'cameras',
    };
  } catch {
    return null;
  }
}

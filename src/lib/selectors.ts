import type {
  Catalog,
  ReviewLine,
  SelectionState,
  Totals,
} from '../state/types';
import { variantKey } from '../state/types';

export function getActiveVariantId(
  catalog: Catalog,
  state: SelectionState,
  productId: string,
): string {
  const active = state.activeVariant[productId];
  if (active) return active;
  const product = catalog.products[productId];
  return product?.variants[0]?.id ?? '';
}

export function getQty(
  state: SelectionState,
  productId: string,
  variantId: string,
): number {
  return state.quantities[variantKey(productId, variantId)] ?? 0;
}

/** Count of distinct products (not variants) with qty > 0 in a step. */
export function getStepSelectedCount(
  catalog: Catalog,
  state: SelectionState,
  stepId: string,
): number {
  const step = catalog.steps.find((s) => s.id === stepId);
  if (!step) return 0;

  // The plan step has no products; it counts the chosen plan instead.
  if (step.id === 'plan') return state.selectedPlanId ? 1 : 0;

  return step.productIds.filter((pid) => {
    const product = catalog.products[pid];
    return product?.variants.some((v) => getQty(state, pid, v.id) > 0);
  }).length;
}

/** Every (product, variant) with qty > 0, tagged with its category, in step order. */
export function getReviewLines(
  catalog: Catalog,
  state: SelectionState,
): ReviewLine[] {
  const lines: ReviewLine[] = [];

  for (const step of catalog.steps) {
    for (const pid of step.productIds) {
      const product = catalog.products[pid];
      if (!product) continue;

      for (const variant of product.variants) {
        const qty = getQty(state, pid, variant.id);
        if (qty <= 0) continue;

        const name =
          variant.label && product.variants.length > 1
            ? `${product.title} — ${variant.label}`
            : product.title;

        lines.push({
          key: variantKey(pid, variant.id),
          category: step.category,
          productId: pid,
          variantId: variant.id,
          name,
          image: variant.swatch ?? product.image,
          qty,
          price: variant.price,
          compareAt: variant.compareAt,
          required: product.required ?? false,
        });
      }
    }
  }

  return lines;
}

export function getReviewGroups(
  catalog: Catalog,
  state: SelectionState,
): Array<{ category: string; lines: ReviewLine[] }> {
  const lines = getReviewLines(catalog, state);
  const order: string[] = [];
  const map = new Map<string, ReviewLine[]>();

  for (const line of lines) {
    if (!map.has(line.category)) {
      map.set(line.category, []);
      order.push(line.category);
    }
    map.get(line.category)!.push(line);
  }

  return order.map((category) => ({ category, lines: map.get(category)! }));
}

// One month of the selected plan is folded into the one-time total, matching the design.
export function getTotals(catalog: Catalog, state: SelectionState): Totals {
  let subtotal = 0;
  let compareAtTotal = 0;

  for (const line of getReviewLines(catalog, state)) {
    subtotal += line.price * line.qty;
    compareAtTotal += (line.compareAt ?? line.price) * line.qty;
  }

  const plan = catalog.plans.find((p) => p.id === state.selectedPlanId);
  if (plan) {
    subtotal += plan.price;
    compareAtTotal += plan.compareAt ?? plan.price;
  }

  const savings = compareAtTotal - subtotal;
  const financingPerMonth = subtotal / (catalog.financing.aprMonths || 12);

  return {
    subtotal,
    compareAtTotal,
    savings,
    financingPerMonth,
  };
}

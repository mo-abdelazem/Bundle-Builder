export interface Variant {
  id: string;
  label: string | null;
  swatch: string | null;
  price: number;
  compareAt: number | null; 
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string | null;
  learnMore: string;
  showInBuilder: boolean;
  required?: boolean;
  variants: Variant[];
}

export interface Step {
  id: string;
  title: string;
  icon: string;
  category: string; 
  productIds: string[];
}

export interface Plan {
  id: string;
  name: string;
  logo: string;
  price: number;
  compareAt: number | null;
  period: string;
}

export interface Catalog {
  steps: Step[];
  products: Record<string, Product>;
  plans: Plan[];
  shipping: { label: string; price: number; compareAt: number | null };
  financing: { aprMonths: number };
  guarantee: { badge: string; title: string; description: string };
  assets: Record<string, string>;
  seed: SelectionState;
}

// The only slice persisted to localStorage.
export interface SelectionState {
  quantities: Record<string, number>;
  activeVariant: Record<string, string>; 
  selectedPlanId: string | null;
  openStepId: string;
}

export interface ReviewLine {
  key: string;
  category: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  qty: number;
  price: number;
  compareAt: number | null;
  required: boolean;
}

export interface Totals {
  subtotal: number; 
  compareAtTotal: number; 
  savings: number;
  financingPerMonth: number;
}

export const variantKey = (productId: string, variantId: string) =>
  `${productId}:${variantId}`;

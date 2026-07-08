import type { Product } from '../../state/types';
import { useBundle } from '../../state/store';
import { getActiveVariantId, getQty } from '../../lib/selectors';
import QuantityStepper from '../shared/QuantityStepper';
import PriceDisplay from '../shared/PriceDisplay';
import VariantSelector from './VariantSelector';

export default function ProductCard({ product }: { product: Product }) {
  const catalog = useBundle((s) => s.catalog)!;
  const selection = useBundle((s) => s.selection);
  const changeQty = useBundle((s) => s.changeQty);
  const setActiveVariant = useBundle((s) => s.setActiveVariant);

  const activeId = getActiveVariantId(catalog, selection, product.id);
  const variant =
    product.variants.find((v) => v.id === activeId) ?? product.variants[0];
  const qty = getQty(selection, product.id, activeId);
  const selected = product.variants.some(
    (v) => getQty(selection, product.id, v.id) > 0,
  );
  const hasVariants = product.variants.some((v) => v.label !== null);

  return (
    <article
      className={`relative rounded-card bg-white p-[11px] transition-colors ${
        selected ? 'border-2 border-selected' : 'border-2 border-transparent'
      }`}
    >
      {product.badge && (
        <span className="absolute left-[11px] top-[11px] z-10 rounded-[10px] bg-primary px-1.5 py-0.5 text-[11px] font-medium leading-none text-white">
          {product.badge}
        </span>
      )}
      <div className="flex flex-col gap-[13px] @max-[394px]/grid:flex-row @max-[394px]/grid:items-center @max-[394px]/grid:gap-3 min-[1292px]:flex-row min-[1292px]:items-center min-[1292px]:gap-3">
        <div className="@max-[394px]/grid:shrink-0 min-[1292px]:shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="mx-auto h-32 w-full object-contain object-center @max-[394px]/grid:mx-0 @max-[394px]/grid:h-[100px] @max-[394px]/grid:w-[100px] @max-[394px]/grid:min-w-[100px] min-[1292px]:mx-0 min-[1292px]:h-[100px] min-[1292px]:w-[100px] min-[1292px]:min-w-[100px]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 @container/pcard">
        <h3 className="text-base font-semibold tracking-[0.6px] text-ink-card">
          {product.title}
        </h3>
        <p className="text-xs leading-[130%] text-desc">
          {product.description}{' '}
          <a
            href={product.learnMore}
            className="text-link underline"
            onClick={(e) => e.preventDefault()}
          >
            Learn More
          </a>
        </p>

        {hasVariants && (
          <VariantSelector
            variants={product.variants}
            activeId={activeId}
            onSelect={(id) => setActiveVariant(product.id, id)}
          />
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <QuantityStepper
            value={qty}
            min={product.required ? 1 : 0}
            disabled={product.required ?? false}
            onChange={(next) =>
              changeQty(product.id, activeId, next - qty)
            }
          />
          <PriceDisplay
            price={variant.price}
            compareAt={variant.compareAt}
            className="shrink-0 text-base @max-[195px]/pcard:flex-col @max-[195px]/pcard:items-end"
          />
        </div>
        </div>
      </div>
    </article>
  );
}

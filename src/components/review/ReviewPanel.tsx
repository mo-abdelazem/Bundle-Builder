import { useState } from 'react';
import { useBundle } from '../../state/store';
import { getReviewGroups, getTotals } from '../../lib/selectors';
import { money } from '../../lib/money';
import QuantityStepper from '../shared/QuantityStepper';

const SUBHEADING = 'text-[12px] font-medium text-ink-card sm:text-[14px]';

export default function ReviewPanel() {
  const catalog = useBundle((s) => s.catalog);
  const selection = useBundle((s) => s.selection);
  const setQty = useBundle((s) => s.setQty);
  const saveForLater = useBundle((s) => s.saveForLater);
  const savedAt = useBundle((s) => s.savedAt);
  const [checkedOut, setCheckedOut] = useState(false);

  if (!catalog) return null;

  const groups = getReviewGroups(catalog, selection);
  const totals = getTotals(catalog, selection);
  const plan = catalog.plans.find((p) => p.id === selection.selectedPlanId);
  const guarantee = catalog.guarantee;

  const isEmpty = groups.length === 0 && !plan;

  const header = (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[1.6px] text-ink-muted">
        Review
      </p>
      <h2 className="mt-2 text-[22px] font-semibold text-ink">
        Your security system
      </h2>
      <p className="mt-1 text-[12px] leading-[130%] text-desc sm:text-[14px]">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>
    </>
  );

  return (
    <>
      <div className="@container rounded-card bg-panel p-6">
      {isEmpty ? (
        <>
          {header}
          <div className="mt-8 flex flex-col items-center gap-1.5 rounded-card border border-dashed border-divider py-12 text-center">
            <p className="text-sm font-semibold text-ink-card">
              Your system is empty
            </p>
            <p className="text-xs text-desc">
              Add products from the builder to start your bundle.
            </p>
          </div>
        </>
      ) : (
        <div className="@min-[820px]:grid @min-[820px]:grid-cols-[1fr_380px] @min-[820px]:gap-8">
          <div>
            {header}

            <div className="mt-5">
              {groups.map((group, gi) => (
                <section
                  key={group.category}
                  className={gi > 0 ? 'mt-4 border-t border-divider pt-4' : ''}
                >
                  <h3 className={SUBHEADING}>{group.category}</h3>
                  <ul className="mt-2 space-y-3">
                    {group.lines.map((line) => {
                      const isFree = line.price === 0;
                      const showCompare =
                        line.compareAt != null && line.compareAt !== line.price;
                      return (
                        <li key={line.key} className="flex items-center gap-3">
                          <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-white">
                            <img
                              src={line.image}
                              alt=""
                              className="h-9 w-9 object-contain"
                            />
                          </div>
                          <span className="min-w-0 flex-1 text-[12px] font-medium text-ink-card sm:text-[14px]">
                            {line.name}
                          </span>
                          <QuantityStepper
                            value={line.qty}
                            min={line.required ? 1 : 0}
                            disabled={line.required}
                            variant="review"
                            onChange={(next) =>
                              setQty(line.productId, line.variantId, next)
                            }
                          />
                          <span className="w-16 text-right tabular-nums">
                            {showCompare && (
                              <span className="block text-[12px] text-strike line-through sm:text-[14px]">
                                {money(line.compareAt! * line.qty)}
                              </span>
                            )}
                            <span
                              className={`text-[12px] font-semibold sm:text-[14px] ${
                                showCompare ? 'text-primary' : 'text-[#6F7882]'
                              }`}
                            >
                              {isFree ? 'FREE' : money(line.price * line.qty)}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              {plan && (
                <section className="mt-4 border-t border-divider pt-4">
                  <h3 className={SUBHEADING}>Plan</h3>
                  <div className="mt-2 flex items-center gap-[3px]">
                    <img
                      src={plan.logo}
                      alt={plan.name}
                      className="w-[132px] shrink-0"
                    />
                    <span className="ml-auto text-right tabular-nums">
                      {plan.compareAt != null && (
                        <span className="mr-1 text-xs text-strike line-through">
                          {money(plan.compareAt)}/{plan.period}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-primary">
                        {money(plan.price)}/{plan.period}
                      </span>
                    </span>
                  </div>
                </section>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-divider pt-4">
              <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-white">
                <img
                  src={catalog.assets.truckIcon}
                  alt=""
                  className="w-[22px] sm:w-[30px]"
                />
              </div>
              <span className="flex-1 text-[12px] font-medium leading-4 text-ink-card sm:text-[14px]">
                {catalog.shipping.label}
              </span>
              <span className="tabular-nums">
                {catalog.shipping.compareAt != null && (
                  <span className="mr-1 text-xs text-strike line-through">
                    {money(catalog.shipping.compareAt)}
                  </span>
                )}
                <span className="text-sm font-semibold text-primary">FREE</span>
              </span>
            </div>
          </div>

          <div className="mt-6 @min-[820px]:mt-0">
            <div className="mb-6 hidden items-start gap-4 @min-[820px]:flex">
              <img
                src={guarantee.badge}
                alt="Satisfaction guarantee"
                className="h-[78px] w-[78px] shrink-0"
              />
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {guarantee.title}
                </h3>
                <p className="mt-1 text-sm leading-[140%] text-desc">
                  {guarantee.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={guarantee.badge}
                alt="Satisfaction guarantee"
                className="h-[78px] w-[78px] shrink-0 @min-[820px]:hidden"
              />
              <div className="ml-auto flex flex-col items-end gap-2 min-[640px]:w-full min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-6 min-[640px]:max-w-[480px] min-[1292px]:w-auto min-[1292px]:max-w-none min-[1292px]:flex-col min-[1292px]:items-end min-[1292px]:gap-2">
                <span className="inline-block rounded-md bg-primary px-2 py-1 text-xs font-medium tracking-[-0.05em] text-white">
                  as low as {money(totals.financingPerMonth)}/mo
                </span>
                <div className="flex items-baseline gap-2">
                  {totals.compareAtTotal > totals.subtotal && (
                    <span className="text-[18px] font-medium text-strike line-through">
                      {money(totals.compareAtTotal)}
                    </span>
                  )}
                  <span className="text-2xl font-bold leading-8 text-primary">
                    {money(totals.subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {totals.savings > 0 && (
              <p className="mt-3 text-center text-xs font-semibold text-savings">
                Congrats! You're saving {money(totals.savings)} on your security
                bundle!
              </p>
            )}

            <button
              type="button"
              className="mt-0.5 w-full rounded-[4px] bg-primary px-4 py-[13px] text-base font-semibold leading-[22px] text-white transition-opacity hover:opacity-90"
              onClick={() => setCheckedOut(true)}
            >
              Checkout
            </button>

            <button
              type="button"
              onClick={saveForLater}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-[14px] italic text-[#484848]"
            >
              <span className="border-b border-current pb-px leading-none">
                {savedAt ? 'Saved' : 'Save my system for later'}
              </span>
              {savedAt && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      </div>

      {checkedOut && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          onClick={() => setCheckedOut(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[10px] bg-white p-6 text-center shadow-2xl"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-savings/10 text-savings">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3
              id="checkout-title"
              className="mt-4 text-lg font-semibold text-ink"
            >
              Your system is ready!
            </h3>
            <p className="mt-2 text-sm leading-[140%] text-desc">
              This is a prototype, so checkout isn't wired up — but your{' '}
              {money(totals.subtotal)} security bundle is all set.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setCheckedOut(false)}
              className="mt-5 w-full rounded-[4px] bg-primary py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

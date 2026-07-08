import type { Step } from '../../state/types';
import { useBundle } from '../../state/store';
import { getStepSelectedCount } from '../../lib/selectors';
import ProductCard from './ProductCard';
import PlanSelector from './PlanSelector';

interface AccordionStepProps {
  step: Step;
  index: number;
  total: number;
}

export default function AccordionStep({ step, index, total }: AccordionStepProps) {
  const catalog = useBundle((s) => s.catalog)!;
  const selection = useBundle((s) => s.selection);
  const toggleStep = useBundle((s) => s.toggleStep);
  const goToNextStep = useBundle((s) => s.goToNextStep);

  const isOpen = selection.openStepId === step.id;
  const count = getStepSelectedCount(catalog, selection, step.id);
  const nextStep = catalog.steps[index + 1];
  const products = step.productIds
    .map((id) => catalog.products[id])
    .filter((p) => p && p.showInBuilder);

  const handleNext = () => {
    if (!nextStep) return;
    goToNextStep(step.id);
    // Wait for the current step's collapse (duration-300) before scrolling, so
    // the next step lands at the top instead of the page clamping to the bottom.
    setTimeout(() => {
      document
        .getElementById(`step-${nextStep.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320);
  };

  return (
    <section
      id={`step-${step.id}`}
      className={`scroll-mt-4 overflow-hidden rounded-[10px] transition-colors duration-300 ${
        isOpen ? 'bg-panel' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => toggleStep(step.id)}
        aria-expanded={isOpen}
        className="block w-full py-4 text-left"
      >
        <p className="px-5 text-[10px] font-medium uppercase leading-none tracking-[1.6px] text-ink-muted sm:text-[12px]">
          Step {index + 1} of {total}
        </p>
        <div
          className={`mt-2 border-[#1F1F1F] ${
            isOpen ? 'border-t-[0.5px]' : 'border-y-[0.5px]'
          }`}
        >
          <div className="flex items-center gap-2 px-5 py-3">
            <img
              src={step.icon}
              alt=""
              className="h-5 w-5 sm:h-[30px] sm:w-[30px]"
            />
            <h2 className="text-[18px] font-semibold text-ink sm:text-[22px]">
              {step.title}
            </h2>
            <span className="ml-auto flex items-center gap-1.5 text-sm text-primary">
              {count} selected
              <img
                src={catalog.assets.chevronDown}
                alt=""
                className={`h-1.5 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </span>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        {...(!isOpen ? { inert: true } : {})}
      >
        <div className="overflow-hidden">
          <div className="px-[15px] pt-5 pb-5">
            {step.id === 'plan' ? (
              <PlanSelector />
            ) : (
              <div className="@container/grid grid gap-[15px] grid-cols-[repeat(auto-fill,minmax(190px,1fr))] min-[1292px]:grid-cols-2">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              {nextStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-[39px] items-center justify-center rounded-[7px] border border-[#4E2FD2] bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Next: {nextStep.title}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('review')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="inline-flex h-[39px] items-center justify-center rounded-[7px] bg-primary px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Review your system
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useBundle } from '../../state/store';
import { money } from '../../lib/money';

export default function PlanSelector() {
  const catalog = useBundle((s) => s.catalog)!;
  const selectedPlanId = useBundle((s) => s.selection.selectedPlanId);
  const selectPlan = useBundle((s) => s.selectPlan);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {catalog.plans.map((plan) => {
        const selected = plan.id === selectedPlanId;
        return (
          <button
            key={plan.id}
            type="button"
            aria-pressed={selected}
            onClick={() => selectPlan(selected ? null : plan.id)}
            className={`flex items-center gap-3 rounded-card bg-white p-4 text-left transition-colors ${
              selected ? 'border-2 border-primary' : 'border-2 border-transparent'
            }`}
          >
            <img src={plan.logo} alt={plan.name} className="h-6 shrink-0" />
            <span className="ml-auto text-sm tabular-nums">
              {plan.compareAt != null && (
                <span className="mr-1 text-compare line-through">
                  {money(plan.compareAt)}/{plan.period}
                </span>
              )}
              <span className="text-primary">
                {money(plan.price)}/{plan.period}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

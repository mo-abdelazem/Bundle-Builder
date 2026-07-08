import { useBundle } from '../../state/store';
import AccordionStep from './AccordionStep';

export default function BundleBuilder() {
  const catalog = useBundle((s) => s.catalog);
  if (!catalog) return null;

  return (
    <div className="flex flex-col gap-2">
      {catalog.steps.map((step, i) => (
        <AccordionStep
          key={step.id}
          step={step}
          index={i}
          total={catalog.steps.length}
        />
      ))}
    </div>
  );
}

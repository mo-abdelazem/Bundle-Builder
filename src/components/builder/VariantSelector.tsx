import type { Variant } from '../../state/types';

interface VariantSelectorProps {
  variants: Variant[];
  activeId: string;
  addedIds: string[];
  onSelect: (variantId: string) => void;
}

const DOT: Record<string, string> = {
  White: '#ffffff',
  Grey: '#9ca3af',
  Black: '#1a1a1a',
};

export default function VariantSelector({
  variants,
  activeId,
  addedIds,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => {
        const active = v.id === activeId;
        const added = addedIds.includes(v.id);
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={active}
            aria-label={`${v.label ?? ''}${added ? ' (added)' : ''}`.trim() || undefined}
            onClick={() => onSelect(v.id)}
            className={`variant-chip inline-flex items-center gap-1.5 rounded-[2px] border-[0.5px] px-[5px] py-px text-xs text-ink-card transition-colors ${
              added ? 'border-savings bg-[#1df0bb0a]' : 'border-[#cccccc]'
            }`}
          >
            {v.swatch ? (
              <img
                src={v.swatch}
                alt=""
                className="h-[22px] w-[22px] object-contain"
              />
            ) : (
              <span
                className="h-[22px] w-[22px] rounded-full border border-[#cccccc]"
                style={{ background: DOT[v.label ?? ''] ?? '#ddd' }}
              />
            )}
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

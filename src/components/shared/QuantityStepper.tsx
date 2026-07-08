interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  disabled?: boolean;
  variant?: 'card' | 'review';
}

const BTN =
  'grid h-5 w-5 place-items-center rounded-[4px] transition-colors';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-3.5 w-3.5',
  'aria-hidden': true,
};
const PlusIcon = (
  <svg {...iconProps}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
const MinusIcon = (
  <svg {...iconProps}>
    <path d="M5 12h14" />
  </svg>
);
const DISABLED = 'border border-[#CED6DE] bg-[#F1F1F2] text-[#575757] cursor-not-allowed';
const DEC = 'border-2 border-[#E6EBF0] text-[#CED6DE]';

export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  disabled = false,
  variant = 'card',
}: QuantityStepperProps) {
  const decDisabled = disabled || value <= min;
  const incStyle =
    variant === 'review' ? 'bg-white text-[#575757]' : 'bg-[#F0F4F7] text-[#525963]';
  const decStyle = variant === 'review' ? incStyle : DEC;

  return (
    <div className="inline-flex select-none items-center gap-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={decDisabled}
        onClick={() => onChange(value - 1)}
        className={`${BTN} ${disabled ? DISABLED : decStyle}`}
      >
        {MinusIcon}
      </button>
      <span className="min-w-4 text-center text-[16px] font-medium leading-5 tabular-nums text-[#0B0D10]">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        className={`${BTN} ${disabled ? DISABLED : incStyle}`}
      >
        {PlusIcon}
      </button>
    </div>
  );
}

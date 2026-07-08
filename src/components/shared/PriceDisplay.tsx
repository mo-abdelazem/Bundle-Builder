import { money } from '../../lib/money';

interface PriceDisplayProps {
  price: number;
  compareAt: number | null;
  className?: string;
}

export default function PriceDisplay({
  price,
  compareAt,
  className = '',
}: PriceDisplayProps) {
  const showCompare = compareAt != null && compareAt !== price;
  const isFree = price === 0;

  return (
    <span
      className={`inline-flex items-baseline gap-x-1 leading-tight tabular-nums ${className}`}
    >
      {showCompare && (
        <span className="text-compare line-through">{money(compareAt)}</span>
      )}
      <span className="text-price">
        {isFree ? 'FREE' : money(price)}
      </span>
    </span>
  );
}

import { Star } from 'lucide-react';

function StarRating({ rating = 0, size = 14, showCount, count }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            fill={n <= rounded ? '#F59E0B' : 'none'}
            color={n <= rounded ? '#F59E0B' : 'var(--border)'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-[var(--muted)]">
          {rating ? rating.toFixed(1) : 'No reviews'}{count ? ` (${count})` : ''}
        </span>
      )}
    </div>
  );
}

export default StarRating;

import React from 'react';

interface VegBadgeProps {
  isEggless: boolean;
  size?: 'sm' | 'md';
}

/**
 * Standard Indian Bakery Vegetarian / Egg dietary indicator
 * Complies with FSSAI standards while adhering to clean unboxed aesthetics.
 */
export function DietaryBadge({ isEggless, size = 'sm' }: VegBadgeProps) {
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-medium ${
        isSm ? 'text-xs' : 'text-sm'
      } ${isEggless ? 'text-emerald-800' : 'text-amber-900'}`}
      title={isEggless ? '100% Vegetarian / Eggless' : 'Contains Eggs'}
    >
      {/* Square symbol with centered circle dot */}
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center border ${
          isSm ? 'w-3.5 h-3.5 border-emerald-600' : 'w-4 h-4 border-emerald-700'
        } ${isEggless ? 'border-emerald-700' : 'border-amber-800'}`}
      >
        <span
          className={`${
            isSm ? 'w-1.5 h-1.5' : 'w-2 h-2'
          } rounded-full ${isEggless ? 'bg-emerald-600' : 'bg-amber-800'}`}
        />
      </span>
      <span>{isEggless ? 'Eggless' : 'With Egg'}</span>
    </div>
  );
}

interface TagBadgeProps {
  label: string;
  variant?: 'featured' | 'bestseller' | 'new';
}

export function ProductTag({ label, variant = 'bestseller' }: TagBadgeProps) {
  // Quiet, unboxed text styling
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-wider ${
        variant === 'bestseller'
          ? 'text-amber-800'
          : variant === 'new'
          ? 'text-rose-700'
          : 'text-stone-700'
      }`}
    >
      ★ {label}
    </span>
  );
}

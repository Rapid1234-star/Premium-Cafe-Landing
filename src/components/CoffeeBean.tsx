import type { CSSProperties } from 'react';

type CoffeeBeanProps = {
  className?: string;
  id?: string;
  style?: CSSProperties;
  /** Prefer the smaller mark for the hero; flyer uses the full-size asset. */
  size?: 'sm' | 'md';
  alt?: string;
  draggable?: boolean;
};

/** Shared brand bean — compressed WebP/PNG from the same source asset. */
export default function CoffeeBean({
  className,
  id,
  style,
  size = 'md',
  alt = '',
  draggable = false,
}: CoffeeBeanProps) {
  const webp = size === 'sm' ? '/images/bean-sm.webp' : '/images/bean.webp';
  const png = size === 'sm' ? '/images/bean-sm.png' : '/images/bean.png';

  return (
    <picture className="contents">
      <source srcSet={webp} type="image/webp" />
      <img
        id={id}
        src={png}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        draggable={draggable}
        className={className}
        style={style}
        decoding="async"
        fetchPriority={size === 'sm' ? 'high' : 'auto'}
      />
    </picture>
  );
}

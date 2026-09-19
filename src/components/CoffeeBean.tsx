import type { CSSProperties, ImgHTMLAttributes } from 'react';

type CoffeeBeanProps = {
  className?: string;
  id?: string;
  style?: CSSProperties;
} & Pick<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'draggable'>;

const BEAN_SRC = '/images/bean.png';

/** Shared brand bean — photoreal PNG used in hero + scroll handoff flyer. */
export default function CoffeeBean({
  className,
  id,
  style,
  alt = '',
  draggable = false,
}: CoffeeBeanProps) {
  return (
    <img
      id={id}
      src={BEAN_SRC}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={draggable}
      className={className}
      style={style}
    />
  );
}

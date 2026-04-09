import React, { useRef } from 'react';
import { cn } from '../../lib/utils';

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  const marqueeRef = useRef(null);

  return (
    <div
      {...props}
      ref={marqueeRef}
      className={cn(
        'group flex overflow-hidden [--gap:1rem]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0',
            vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee',
            vertical ? '[gap:1rem]' : '[gap:1rem]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]'
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { createIcon, PrimitiveIcon } from '@gluestack-ui/icon';

const SIZE_MAP = {
  '2xs': 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

export const UIIcon = createIcon({
  Root: PrimitiveIcon,
});

export const Icon = React.forwardRef(function Icon(
  { as, size = 'md', color, strokeWidth, ...props },
  ref,
) {
  const resolvedSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 18;

  return (
    <UIIcon
      ref={ref}
      as={as}
      size={resolvedSize}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
});

export { createIcon } from '@gluestack-ui/icon';

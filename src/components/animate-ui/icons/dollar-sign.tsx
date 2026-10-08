'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type DollarSignProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scale: 1, rotate: 0 },
      animate: { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.4 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: DollarSignProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.g variants={variants.group} initial="initial" animate={controls}>
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </motion.g>
    </motion.svg>
  );
}

function DollarSign(props: DollarSignProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { DollarSign, DollarSign as DollarSignIcon, type DollarSignProps };

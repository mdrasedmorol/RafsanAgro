'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type AlertCircleProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.15, 1],
        rotate: [0, -10, 10, -5, 5, 0],
        transition: { ease: 'easeInOut', duration: 0.5 },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: AlertCircleProps) {
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </motion.g>
    </motion.svg>
  );
}

function AlertCircle(props: AlertCircleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { AlertCircle, AlertCircle as AlertCircleIcon, type AlertCircleProps };

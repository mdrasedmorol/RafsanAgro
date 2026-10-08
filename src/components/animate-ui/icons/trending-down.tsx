'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type TrendingDownProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    arrow: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, 2, 0],
        y: [0, 2, 0],
        transition: { ease: 'easeInOut', duration: 0.4 },
      },
    },
    line: {
      initial: { pathLength: 1 },
      animate: { pathLength: [0.5, 1], transition: { duration: 0.4 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: TrendingDownProps) {
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
      <motion.polyline points="22 17 13.5 8.5 8.5 13.5 2 7" variants={variants.line} initial="initial" animate={controls} />
      <motion.polyline points="16 17 22 17 22 11" variants={variants.arrow} initial="initial" animate={controls} />
    </motion.svg>
  );
}

function TrendingDown(props: TrendingDownProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { TrendingDown, TrendingDown as TrendingDownIcon, type TrendingDownProps };

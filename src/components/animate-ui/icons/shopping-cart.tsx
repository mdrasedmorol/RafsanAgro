'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type ShoppingCartProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { x: 0, y: 0, rotate: 0 },
      animate: {
        x: [0, -2, 3, -1, 0],
        y: [0, -1, 0],
        rotate: [0, -2, 2, 0],
        transition: { ease: 'easeInOut', duration: 0.5 },
      },
    },
    wheel1: {
      initial: { rotate: 0 },
      animate: { rotate: 360, transition: { ease: 'linear', duration: 0.5 } },
    },
    wheel2: {
      initial: { rotate: 0 },
      animate: { rotate: 360, transition: { ease: 'linear', duration: 0.5 } },
    },
  } satisfies Record<string, Variants>,
  bounce: {
    group: {
      initial: { y: 0 },
      animate: { y: [0, -4, 0], transition: { ease: 'easeOut', duration: 0.4 } },
    },
    wheel1: {},
    wheel2: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: ShoppingCartProps) {
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
        <motion.circle cx="8" cy="21" r="1" variants={variants.wheel1} />
        <motion.circle cx="19" cy="21" r="1" variants={variants.wheel2} />
        <motion.path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </motion.g>
    </motion.svg>
  );
}

function ShoppingCart(props: ShoppingCartProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { ShoppingCart, ShoppingCart as ShoppingCartIcon, type ShoppingCartProps };

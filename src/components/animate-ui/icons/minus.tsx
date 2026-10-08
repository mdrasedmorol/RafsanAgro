'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type MinusProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scaleX: 1 },
      animate: { scaleX: [1, 0.7, 1.1, 1], transition: { duration: 0.3 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MinusProps) {
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
      <motion.path d="M5 12h14" variants={variants.group} initial="initial" animate={controls} />
    </motion.svg>
  );
}

function Minus(props: MinusProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { Minus, Minus as MinusIcon, type MinusProps };

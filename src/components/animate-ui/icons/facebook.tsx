'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FacebookProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scale: 1, y: 0 },
      animate: { scale: [1, 1.15, 1], y: [0, -2, 0], transition: { duration: 0.3 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: FacebookProps) {
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
      <motion.path
        variants={variants.group}
        initial="initial"
        animate={controls}
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      />
    </motion.svg>
  );
}

function Facebook(props: FacebookProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { Facebook, Facebook as FacebookIcon, type FacebookProps };

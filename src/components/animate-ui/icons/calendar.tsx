'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type CalendarProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: { y: [0, -3, 0], transition: { duration: 0.3 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: CalendarProps) {
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
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </motion.g>
    </motion.svg>
  );
}

function Calendar(props: CalendarProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { Calendar, Calendar as CalendarIcon, type CalendarProps };

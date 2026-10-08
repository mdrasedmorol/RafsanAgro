'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FileTextProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: { y: [0, -3, 0], transition: { duration: 0.3 } },
    },
    lines: {
      initial: { pathLength: 1 },
      animate: { pathLength: [0, 1], transition: { duration: 0.4 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: FileTextProps) {
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
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <motion.path d="M10 9H8" variants={variants.lines} />
        <motion.path d="M16 13H8" variants={variants.lines} />
        <motion.path d="M16 17H8" variants={variants.lines} />
      </motion.g>
    </motion.svg>
  );
}

function FileText(props: FileTextProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { FileText, FileText as FileTextIcon, type FileTextProps };

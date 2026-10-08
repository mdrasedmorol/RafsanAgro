'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FolderProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.08, 1], transition: { duration: 0.3 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: FolderProps) {
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
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </motion.svg>
  );
}

function Folder(props: FolderProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { Folder, Folder as FolderIcon, type FolderProps };

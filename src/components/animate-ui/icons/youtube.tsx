'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type YoutubeProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.12, 1], transition: { duration: 0.3 } },
    },
    play: {
      initial: { x: 0 },
      animate: { x: [0, 2, 0], transition: { duration: 0.3 } },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: YoutubeProps) {
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
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <motion.polygon points="10 15 15 12 10 9 10 15" fill="currentColor" variants={variants.play} />
      </motion.g>
    </motion.svg>
  );
}

function Youtube(props: YoutubeProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { Youtube, Youtube as YoutubeIcon, type YoutubeProps };

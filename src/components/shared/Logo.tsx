'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 200, height = 64 }: LogoProps) {
  return (
    <div className={cn('inline-block', className)} style={{ width: `${width}px`, height: `${height}px` }}>
      <Image
        src="/logo.png"
        alt="GymNFC"
        width={width}
        height={height}
        className="w-full h-full object-contain"
        priority
        unoptimized
      />
    </div>
  );
}

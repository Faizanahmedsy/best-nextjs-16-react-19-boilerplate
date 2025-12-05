"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function OwlAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
  const eyeX = useMemo(() => {
    const clamped = Math.min(Math.max(lookAt, 0), 100);
    return (clamped / 100) * 8 - 4;
  }, [lookAt]);

  return (
    <div className="pointer-events-none relative z-10 mb-[-28px] flex justify-center">
      <svg width="120" height="100" viewBox="0 0 120 100" className="overflow-visible">
        {/* Body */}
        <ellipse
          cx="60"
          cy="60"
          rx="35"
          ry="40"
          className="fill-background stroke-border stroke-2"
        />

        {/* Ears */}
        <path d="M35 30 L 25 15 L 45 25 Z" className="fill-background stroke-border stroke-2" />
        <path d="M85 30 L 95 15 L 75 25 Z" className="fill-background stroke-border stroke-2" />

        {/* Eyes */}
        <circle cx="45" cy="50" r="12" className="fill-background stroke-foreground stroke-2" />
        <circle cx="75" cy="50" r="12" className="fill-background stroke-foreground stroke-2" />

        {/* Pupils */}
        <g
          style={{ transform: `translateX(${eyeX}px)` }}
          className="transition-transform duration-100"
        >
          <circle cx="45" cy="50" r="4" className="fill-foreground" />
          <circle cx="75" cy="50" r="4" className="fill-foreground" />
        </g>

        {/* Beak */}
        <path d="M60 60 L 55 68 L 65 68 Z" className="fill-primary" />

        {/* Wings (The Cover Mechanism) */}
        {/* Left Wing */}
        <path
          d="M25 60 C 10 60, 10 90, 25 90 C 40 90, 40 60, 25 60"
          className={cn(
            "fill-foreground origin-[25px_90px] transition-transform duration-300 ease-in-out",
            isPasswordFocused ? "translate-y-[-10px] rotate-[130deg]" : "rotate-0"
          )}
        />
        {/* Right Wing */}
        <path
          d="M95 60 C 110 60, 110 90, 95 90 C 80 90, 80 60, 95 60"
          className={cn(
            "fill-foreground origin-[95px_90px] transition-transform duration-300 ease-in-out",
            isPasswordFocused ? "translate-y-[-10px] rotate-[-130deg]" : "rotate-0"
          )}
        />
      </svg>
    </div>
  );
}

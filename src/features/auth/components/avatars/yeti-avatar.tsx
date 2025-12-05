"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function YetiAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
  const eyeX = useMemo(() => {
    const clamped = Math.min(Math.max(lookAt, 0), 100);
    return (clamped / 100) * 10 - 5;
  }, [lookAt]);

  return (
    <div className="pointer-events-none relative z-10 mb-[-28px] flex justify-center">
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        className="transition-transform duration-300 ease-out"
      >
        {/* Body */}
        <path
          d="M15 50 C 15 10, 105 10, 105 50 L 105 100 L 15 100 Z"
          className="fill-foreground/5 stroke-border stroke-2"
        />

        {/* Face Patch */}
        <path
          d="M35 40 C 35 30, 85 30, 85 40 L 85 65 C 85 75, 35 75, 35 65 Z"
          className="fill-background stroke-border stroke-2"
        />

        {/* Eyes Group */}
        <g className="transition-transform duration-200">
          <circle cx="48" cy="52" r="5" className="fill-foreground" />
          <circle cx="72" cy="52" r="5" className="fill-foreground" />

          {/* Pupils */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="transition-transform duration-100"
          >
            <circle cx="50" cy="50" r="2" className="fill-background" />
            <circle cx="74" cy="50" r="2" className="fill-background" />
          </g>
        </g>

        {/* Muzzle/Nose */}
        <ellipse cx="60" cy="62" rx="8" ry="5" className="fill-muted-foreground/20" />

        {/* Paws (The Cover Mechanism) */}
        <g
          className={cn(
            "cubic-bezier(0.68, -0.55, 0.265, 1.55) transition-all duration-300",
            isPasswordFocused ? "translate-y-[-45px]" : "translate-y-[10px]"
          )}
        >
          {/* Left Paw */}
          <circle cx="25" cy="100" r="15" className="fill-foreground stroke-background stroke-2" />
          <circle cx="20" cy="95" r="4" className="fill-background/50" />
          <circle cx="25" cy="92" r="4" className="fill-background/50" />
          <circle cx="30" cy="95" r="4" className="fill-background/50" />

          {/* Right Paw */}
          <circle cx="95" cy="100" r="15" className="fill-foreground stroke-background stroke-2" />
          <circle cx="90" cy="95" r="4" className="fill-background/50" />
          <circle cx="95" cy="92" r="4" className="fill-background/50" />
          <circle cx="100" cy="95" r="4" className="fill-background/50" />
        </g>
      </svg>
    </div>
  );
}

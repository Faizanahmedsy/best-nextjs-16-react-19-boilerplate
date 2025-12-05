"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function GeekAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
  const eyeX = useMemo(() => {
    const clamped = Math.min(Math.max(lookAt, 0), 100);
    return (clamped / 100) * 10 - 5;
  }, [lookAt]);

  return (
    <div className="pointer-events-none relative z-10 mb-[-28px] flex justify-center">
      <svg width="120" height="100" viewBox="0 0 120 100">
        {/* Head */}
        <circle cx="60" cy="50" r="35" className="fill-background stroke-border stroke-2" />

        {/* Hair */}
        <path
          d="M30 40 C 30 10, 90 10, 90 40"
          className="fill-foreground stroke-foreground stroke-2"
        />

        {/* Glasses */}
        <g className="stroke-foreground fill-background/50 stroke-2">
          <circle cx="45" cy="50" r="10" />
          <circle cx="75" cy="50" r="10" />
          <line x1="55" y1="50" x2="65" y2="50" />
        </g>

        {/* Pupils */}
        <g
          style={{ transform: `translateX(${eyeX}px)` }}
          className="transition-transform duration-100"
        >
          <circle cx="45" cy="50" r="3" className="fill-foreground" />
          <circle cx="75" cy="50" r="3" className="fill-foreground" />
        </g>

        {/* Hands (Hands cover the glasses) */}
        <g
          className={cn(
            "transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
            isPasswordFocused ? "translate-y-[-45px]" : "translate-y-[10px]"
          )}
        >
          <rect x="25" y="90" width="20" height="25" rx="8" className="fill-foreground" />
          <rect x="75" y="90" width="20" height="25" rx="8" className="fill-foreground" />
        </g>
      </svg>
    </div>
  );
}

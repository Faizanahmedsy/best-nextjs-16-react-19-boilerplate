"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function SentinelAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
  const eyeX = useMemo(() => {
    const clamped = Math.min(Math.max(lookAt, 0), 100);
    return (clamped / 100) * 16 - 8; // Wider range for cyclops
  }, [lookAt]);

  return (
    <div className="pointer-events-none relative z-10 mb-[-28px] flex justify-center">
      <svg width="120" height="100" viewBox="0 0 120 100">
        {/* Chassis */}
        <path
          d="M30 20 L 90 20 L 100 50 L 90 80 L 30 80 L 20 50 Z"
          className="fill-background stroke-foreground stroke-2"
        />

        {/* Eye Socket (Clips the pupil and shutter) */}
        <mask id="eye-socket">
          <rect x="35" y="40" width="50" height="20" rx="4" fill="white" />
        </mask>

        {/* Eye Background */}
        <rect x="35" y="40" width="50" height="20" rx="4" className="fill-muted/50" />

        {/* The Eye */}
        <g mask="url(#eye-socket)">
          {/* Pupil */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="transition-transform duration-100"
          >
            <rect x="55" y="40" width="10" height="20" className="fill-primary" />
            <rect x="58" y="42" width="4" height="16" className="fill-primary-foreground/50" />
          </g>

          {/* Shutter Mechanism (Top and Bottom closing in) */}
          <rect
            x="35"
            y="30"
            width="50"
            height="20"
            className={cn(
              "fill-foreground transition-all duration-300 ease-in-out",
              isPasswordFocused ? "translate-y-[10px]" : "translate-y-0"
            )}
          />
          <rect
            x="35"
            y="50"
            width="50"
            height="20"
            className={cn(
              "fill-foreground transition-all duration-300 ease-in-out",
              isPasswordFocused ? "translate-y-[-10px]" : "translate-y-0"
            )}
          />
        </g>

        {/* Frame Overlay */}
        <rect
          x="35"
          y="40"
          width="50"
          height="20"
          rx="4"
          className="stroke-foreground fill-none stroke-2"
        />

        {/* Antenna */}
        <line x1="60" y1="20" x2="60" y2="5" className="stroke-foreground stroke-2" />
        <circle
          cx="60"
          cy="5"
          r="3"
          className={cn(
            "fill-destructive transition-opacity duration-300",
            isPasswordFocused ? "animate-pulse opacity-100" : "opacity-0"
          )}
        />
      </svg>
    </div>
  );
}

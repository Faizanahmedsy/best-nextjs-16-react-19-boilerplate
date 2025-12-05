"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function CatAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
  // Same math as the original to ensure consistent eye movement
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
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-out"
        aria-hidden="true"
      >
        {/* --- EARS --- */}
        {/* Placed behind head so the stroke connects nicely */}
        <path d="M20 20 L 15 0 L 45 20 Z" className="fill-background stroke-border stroke-[2px]" />
        <path
          d="M100 20 L 105 0 L 75 20 Z"
          className="fill-background stroke-border stroke-[2px]"
        />

        {/* --- HEAD --- */}
        <rect
          x="15"
          y="15"
          width="90"
          height="85"
          rx="35"
          className="fill-background stroke-border stroke-[2px]"
        />

        {/* --- FACE DETAILS --- */}
        {/* Nose */}
        <path d="M55 62 L 65 62 L 60 68 Z" className="fill-pink-400" />

        {/* Mouth */}
        <path
          d="M60 68 Q 55 75 50 72 M 60 68 Q 65 75 70 72"
          className="stroke-foreground fill-none stroke-[1.5px]"
          strokeLinecap="round"
        />

        {/* Whiskers (Left) */}
        <path
          d="M25 65 L 45 68 M 25 72 L 45 72"
          className="stroke-muted-foreground stroke-[1.5px] opacity-50"
        />
        {/* Whiskers (Right) */}
        <path
          d="M95 65 L 75 68 M 95 72 L 75 72"
          className="stroke-muted-foreground stroke-[1.5px] opacity-50"
        />

        {/* --- EYES GROUP --- */}
        <g className="transition-transform duration-200 ease-out">
          <circle cx="45" cy="50" r="8" className="fill-foreground" />
          <circle cx="75" cy="50" r="8" className="fill-foreground" />

          {/* Pupils */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="linear transition-transform duration-100"
          >
            <circle cx="47" cy="48" r="3" className="fill-background" />
            <circle cx="77" cy="48" r="3" className="fill-background" />
          </g>
        </g>

        {/* --- PAWS (The Shutter Mechanism) --- */}
        {/* 
            Using the exact same diagonal logic as the fixed LoginAvatar 
            so they land perfectly on the eyes.
        */}

        {/* Left Paw */}
        <g
          className={cn(
            "cubic-bezier(0.175, 0.885, 0.32, 1.275) transition-all duration-300",
            isPasswordFocused
              ? "translate-x-[25px] -translate-y-[60px]" // Adjusted Y slightly for eye height
              : "translate-x-0 translate-y-0"
          )}
        >
          <circle
            cx="20"
            cy="110"
            r="14"
            className="fill-foreground stroke-background stroke-[2px]"
          />
          {/* Paw Pad (Pink) */}
          <ellipse cx="20" cy="112" rx="6" ry="4" className="fill-pink-400 opacity-80" />
        </g>

        {/* Right Paw */}
        <g
          className={cn(
            "cubic-bezier(0.175, 0.885, 0.32, 1.275) transition-all duration-300",
            isPasswordFocused
              ? "-translate-x-[25px] -translate-y-[60px]"
              : "translate-x-0 translate-y-0"
          )}
        >
          <circle
            cx="100"
            cy="110"
            r="14"
            className="fill-foreground stroke-background stroke-[2px]"
          />
          {/* Paw Pad (Pink) */}
          <ellipse cx="100" cy="112" rx="6" ry="4" className="fill-pink-400 opacity-80" />
        </g>
      </svg>
    </div>
  );
}

"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface LoginAvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function LoginAvatar({ isPasswordFocused, lookAt }: LoginAvatarProps) {
  // Calculate eye movement (clamped)
  const eyeX = useMemo(() => {
    const clamped = Math.min(Math.max(lookAt, 0), 100);
    return (clamped / 100) * 10 - 5; // Range: -5px to 5px
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
        {/* --- HEAD SHAPE --- */}
        <rect
          x="10"
          y="10"
          width="100"
          height="90"
          rx="40"
          className="fill-background stroke-border stroke-[2px]"
        />

        {/* --- EARS --- */}
        <path
          d="M30 10L20 0M90 10L100 0"
          className="stroke-border stroke-[2px]"
          strokeLinecap="round"
        />

        {/* --- FACE MASK (Dark Visor) --- */}
        <path
          d="M25 45 C 25 35, 95 35, 95 45 L 95 65 C 95 75, 25 75, 25 65 Z"
          className="fill-primary/10"
        />

        {/* --- EYES GROUP --- */}
        <g className="transition-transform duration-200 ease-out">
          {/* Left Eye Container */}
          <circle cx="45" cy="55" r="8" className="fill-foreground" />
          {/* Right Eye Container */}
          <circle cx="75" cy="55" r="8" className="fill-foreground" />

          {/* PUPILS (The moving part) */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="linear transition-transform duration-100"
          >
            <circle cx="47" cy="53" r="3" className="fill-background" />
            <circle cx="77" cy="53" r="3" className="fill-background" />
          </g>
        </g>

        {/* --- HANDS (The Shutter Mechanism) --- */}
        {/* 
            Strategy: 
            Start them at the bottom corners (y=110).
            Translate them DIAGONALLY to land exactly on the eyes (y=55).
        */}

        {/* Left Hand */}
        <circle
          cx="20"
          cy="110"
          r="14"
          className={cn(
            "fill-foreground stroke-background cubic-bezier(0.175, 0.885, 0.32, 1.275) stroke-[2px] transition-all duration-300",
            isPasswordFocused
              ? "translate-x-[25px] -translate-y-[55px]" // Moves to x=45, y=55
              : "translate-x-0 translate-y-0"
          )}
        />

        {/* Right Hand */}
        <circle
          cx="100"
          cy="110"
          r="14"
          className={cn(
            "fill-foreground stroke-background cubic-bezier(0.175, 0.885, 0.32, 1.275) stroke-[2px] transition-all duration-300",
            isPasswordFocused
              ? "-translate-x-[25px] -translate-y-[55px]" // Moves to x=75, y=55
              : "translate-x-0 translate-y-0"
          )}
        />
      </svg>
    </div>
  );
}

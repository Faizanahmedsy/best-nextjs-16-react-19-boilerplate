"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  isPasswordVisible?: boolean;
  lookAt: number;
}

export function HomeAvatar({ isPasswordFocused, isPasswordVisible, lookAt }: AvatarProps) {
  const clamped = Math.min(Math.max(lookAt, 0), 100);
  const eyeX = (clamped / 100) * 10 - 5;

  return (
    <div className="pointer-events-none relative z-10 -mb-7 flex justify-center">
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-out"
        aria-hidden="true"
      >
        {/* --- CHIMNEY --- */}
        <rect
          x="85"
          y="15"
          width="12"
          height="20"
          className="fill-muted-foreground/20 stroke-border stroke-[2px]"
        />
        <circle cx="91" cy="10" r="3" className="fill-muted-foreground/30 animate-pulse" />
        <circle cx="95" cy="4" r="2" className="fill-muted-foreground/20 animate-pulse delay-75" />

        {/* --- HOUSE BODY --- */}
        <rect
          x="20"
          y="40"
          width="80"
          height="60"
          className="fill-background stroke-border stroke-[2px]"
        />
        <path
          d="M10 40 L 60 5 L 110 40 L 105 40 L 60 10 L 15 40 Z"
          className="fill-primary stroke-primary stroke-[2px] shadow-sm"
        />
        <path
          d="M50 100 L 50 80 Q 60 75 70 80 L 70 100"
          className="stroke-border fill-muted/30 stroke-[2px]"
        />

        {/* --- EYES --- */}
        <g className="transition-transform duration-200 ease-out">
          <rect
            x="35"
            y="50"
            width="20"
            height="20"
            rx="2"
            className="fill-background stroke-foreground stroke-[1.5px]"
          />
          <rect
            x="65"
            y="50"
            width="20"
            height="20"
            rx="2"
            className="fill-background stroke-foreground stroke-[1.5px]"
          />
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="linear transition-transform duration-100"
          >
            <rect x="42" y="57" width="6" height="6" className="fill-foreground" />
            <rect x="72" y="57" width="6" height="6" className="fill-foreground" />
          </g>
          <path d="M33 72 L 57 72" className="stroke-border stroke-[2px]" />
          <path d="M63 72 L 87 72" className="stroke-border stroke-[2px]" />
        </g>

        {/* --- HEDGES (Hands with Peeking Logic) --- */}

        {/* Left Hedge */}
        <g
          className={cn(
            "cubic-bezier(0.34, 1.56, 0.64, 1) transition-all duration-500",
            isPasswordFocused
              ? isPasswordVisible
                ? "translate-x-[15px] -translate-y-[55px]"
                : "translate-x-[25px] -translate-y-[55px]"
              : "translate-x-0 translate-y-0"
          )}
        >
          <circle
            cx="20"
            cy="115"
            r="13"
            className="fill-emerald-600 stroke-emerald-800 stroke-[2px]"
          />
          <circle cx="14" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="26" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="20" cy="106" r="8" className="fill-emerald-600" />
        </g>

        {/* Right Hedge */}
        <g
          className={cn(
            "cubic-bezier(0.34, 1.56, 0.64, 1) transition-all duration-500",
            isPasswordFocused
              ? isPasswordVisible
                ? "-translate-x-[15px] -translate-y-[55px]"
                : "-translate-x-[25px] -translate-y-[55px]"
              : "translate-x-0 translate-y-0"
          )}
        >
          <circle
            cx="100"
            cy="115"
            r="13"
            className="fill-emerald-600 stroke-emerald-800 stroke-[2px]"
          />
          <circle cx="94" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="106" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="100" cy="106" r="8" className="fill-emerald-600" />
        </g>
      </svg>
    </div>
  );
}

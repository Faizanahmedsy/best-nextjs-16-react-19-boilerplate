"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  lookAt: number;
}

export function HomeAvatar({ isPasswordFocused, lookAt }: AvatarProps) {
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

        {/* --- ROOF --- */}
        <path
          d="M10 40 L 60 5 L 110 40 L 105 40 L 60 10 L 15 40 Z"
          className="fill-primary stroke-primary stroke-[2px] shadow-sm"
        />

        {/* --- DOOR --- */}
        <path
          d="M50 100 L 50 80 Q 60 75 70 80 L 70 100"
          className="stroke-border fill-muted/30 stroke-[2px]"
        />

        {/* --- WINDOWS (Eyes) --- */}
        {/* 
           Left Window Center: x=45, y=60 (Rect is x=35, y=50, w=20, h=20)
           Right Window Center: x=75, y=60 (Rect is x=65, y=50, w=20, h=20)
        */}
        <g className="transition-transform duration-200 ease-out">
          {/* Frames */}
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

          {/* Pupils */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="linear transition-transform duration-100"
          >
            <rect x="42" y="57" width="6" height="6" className="fill-foreground" />
            <rect x="72" y="57" width="6" height="6" className="fill-foreground" />
          </g>

          {/* Window Sills */}
          <path d="M33 72 L 57 72" className="stroke-border stroke-[2px]" />
          <path d="M63 72 L 87 72" className="stroke-border stroke-[2px]" />
        </g>

        {/* --- HEDGES (Hands) --- */}

        {/* Left Hedge Group */}
        {/* Start Position Center: x=20, y=115 */}
        {/* Target Position Center: x=45, y=60 (Window Center) */}
        {/* Delta: x +25, y -55 */}
        <g
          className={cn(
            "cubic-bezier(0.34, 1.56, 0.64, 1) transition-all duration-500",
            isPasswordFocused
              ? "translate-x-[25px] -translate-y-[55px]"
              : "translate-x-0 translate-y-0"
          )}
        >
          {/* Main Bush Body */}
          <circle
            cx="20"
            cy="115"
            r="13"
            className="fill-emerald-600 stroke-emerald-800 stroke-[2px]"
          />
          {/* Fluff Details */}
          <circle cx="14" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="26" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="20" cy="106" r="8" className="fill-emerald-600" />
        </g>

        {/* Right Hedge Group */}
        {/* Start Position Center: x=100, y=115 */}
        {/* Target Position Center: x=75, y=60 (Window Center) */}
        {/* Delta: x -25, y -55 */}
        <g
          className={cn(
            "cubic-bezier(0.34, 1.56, 0.64, 1) transition-all duration-500",
            isPasswordFocused
              ? "-translate-x-[25px] -translate-y-[55px]"
              : "translate-x-0 translate-y-0"
          )}
        >
          {/* Main Bush Body */}
          <circle
            cx="100"
            cy="115"
            r="13"
            className="fill-emerald-600 stroke-emerald-800 stroke-[2px]"
          />
          {/* Fluff Details */}
          <circle cx="94" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="106" cy="110" r="8" className="fill-emerald-600" />
          <circle cx="100" cy="106" r="8" className="fill-emerald-600" />
        </g>
      </svg>
    </div>
  );
}

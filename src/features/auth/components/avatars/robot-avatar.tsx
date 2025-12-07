"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  isPasswordFocused: boolean;
  isPasswordVisible?: boolean;
  lookAt: number;
}

export function RobotAvatar({ isPasswordFocused, isPasswordVisible, lookAt }: AvatarProps) {
  const clamped = Math.min(Math.max(lookAt, 0), 100);
  const eyeX = (clamped / 100) * 12 - 6;

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
        {/* --- ANTENNA --- */}
        <path d="M60 10 L 60 0" className="stroke-border stroke-[2px]" />
        <circle cx="60" cy="0" r="3" className="animate-pulse fill-red-500" />

        {/* --- HEAD --- */}
        <rect
          x="20"
          y="10"
          width="80"
          height="70"
          rx="12"
          className="stroke-border fill-zinc-200 stroke-[2px] dark:fill-zinc-800"
        />

        {/* --- FACE SCREEN --- */}
        <rect x="30" y="25" width="60" height="40" rx="6" className="fill-black" />

        {/* --- EYES (Digital) --- */}
        <g className="transition-transform duration-200 ease-out">
          {/* Eye Backgrounds */}
          <rect x="40" y="35" width="16" height="20" rx="2" className="fill-cyan-900/50" />
          <rect x="64" y="35" width="16" height="20" rx="2" className="fill-cyan-900/50" />

          {/* Glowing Pupils */}
          <g
            style={{ transform: `translateX(${eyeX}px)` }}
            className="linear transition-transform duration-100"
          >
            <rect
              x="44"
              y="40"
              width="8"
              height="10"
              className="fill-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            />
            <rect
              x="68"
              y="40"
              width="8"
              height="10"
              className="fill-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            />
          </g>
        </g>

        {/* --- NECK --- */}
        <path
          d="M45 80 L 40 100 H 80 L 75 80 Z"
          className="stroke-border fill-zinc-300 stroke-[2px] dark:fill-zinc-700"
        />

        {/* --- HANDS (Mechanical Clamps) --- */}

        {/* Left Clamp */}
        <g
          className={cn(
            "cubic-bezier(0.175, 0.885, 0.32, 1.275) transition-all duration-300",
            isPasswordFocused
              ? isPasswordVisible
                ? "translate-x-[20px] -translate-y-[55px]" // Peek
                : "translate-x-[28px] -translate-y-[55px]" // Cover
              : "translate-x-0 translate-y-0"
          )}
        >
          {/* Arm */}
          <rect
            x="15"
            y="100"
            width="10"
            height="30"
            className="stroke-border fill-zinc-400 stroke-[2px]"
          />
          {/* Clamp Hand */}
          <path
            d="M10 90 L 10 110 L 30 110 L 30 90 L 25 90 L 25 105 L 15 105 L 15 90 Z"
            className="stroke-border fill-zinc-300 stroke-[2px]"
          />
        </g>

        {/* Right Clamp */}
        <g
          className={cn(
            "cubic-bezier(0.175, 0.885, 0.32, 1.275) transition-all duration-300",
            isPasswordFocused
              ? isPasswordVisible
                ? "-translate-x-[20px] -translate-y-[55px]" // Peek
                : "-translate-x-[28px] -translate-y-[55px]" // Cover
              : "translate-x-0 translate-y-0"
          )}
        >
          {/* Arm */}
          <rect
            x="95"
            y="100"
            width="10"
            height="30"
            className="stroke-border fill-zinc-400 stroke-[2px]"
          />
          {/* Clamp Hand */}
          <path
            d="M90 90 L 90 110 L 110 110 L 110 90 L 105 90 L 105 105 L 95 105 L 95 90 Z"
            className="stroke-border fill-zinc-300 stroke-[2px]"
          />
        </g>
      </svg>
    </div>
  );
}

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0";

const styles = {
  green: {
    normal: "bg-green-600 hover:bg-green-500 cursor-pointer",
    disabled: "bg-zinc-700 text-zinc-500 cursor-not-allowed",
    busy: "bg-green-600 opacity-60 cursor-not-allowed",
  },
  blue: {
    normal: "bg-blue-600 hover:bg-blue-500 cursor-pointer",
    disabled: "bg-blue-600/50 text-white/50 cursor-not-allowed",
    busy: "bg-blue-600 opacity-60 cursor-not-allowed",
  },
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: keyof typeof styles;
}

export function Button({
  children,
  loading = false,
  variant = "green",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const state = loading ? "busy" : disabled ? "disabled" : "normal";

  return (
    <button
      disabled={isDisabled}
      className={`${base} ${styles[variant][state]} ${className}`}
      {...props}>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

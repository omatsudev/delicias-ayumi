import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "dark" | "ghost" | "soft" | "link" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-[oklch(var(--c-primary))] text-white hover:opacity-90",
  dark:    "bg-[oklch(var(--c-fg))] text-[oklch(var(--c-bg))] hover:opacity-90",
  ghost:   "border border-[oklch(var(--c-line))] text-[oklch(var(--c-fg))] hover:bg-[oklch(var(--c-surface-2))]",
  soft:    "bg-[oklch(var(--c-primary-soft))] text-[oklch(var(--c-primary))] hover:opacity-90",
  link:    "text-[oklch(var(--c-primary))] underline-offset-2 hover:underline p-0",
  danger:  "bg-[oklch(var(--c-danger))] text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 rounded-lg",
  md: "text-sm px-5 py-2.5 rounded-xl",
  lg: "text-base px-7 py-3.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(var(--c-primary))]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        variant !== "link" && sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
);

Button.displayName = "Button";

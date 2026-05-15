import { cn } from "../../lib/utils";

type Tone = "neutral" | "primary" | "accent" | "danger" | "warn";

interface TagProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: "bg-[oklch(var(--c-surface-2))] text-[oklch(var(--c-fg-soft))]",
  primary: "bg-[oklch(var(--c-primary-soft))] text-[oklch(var(--c-primary))]",
  accent:  "bg-[oklch(var(--c-accent-soft))] text-[oklch(var(--c-accent))]",
  danger:  "bg-red-50 text-[oklch(var(--c-danger))]",
  warn:    "bg-yellow-50 text-[oklch(var(--c-warn))]",
};

export function Tag({ tone = "neutral", children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

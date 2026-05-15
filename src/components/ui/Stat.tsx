import { Card } from "./Card";
import { cn } from "../../lib/utils";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Stat({ label, value, delta, deltaPositive, icon, className }: StatProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[oklch(var(--c-fg-muted))] uppercase tracking-wide">
            {label}
          </span>
          <span className="text-2xl font-semibold font-display text-[oklch(var(--c-fg))]">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "text-xs font-medium",
                deltaPositive
                  ? "text-[oklch(var(--c-accent))]"
                  : "text-[oklch(var(--c-danger))]"
              )}
            >
              {delta}
            </span>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-[oklch(var(--c-primary-soft))] text-[oklch(var(--c-primary))] shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

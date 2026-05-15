import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[oklch(var(--c-surface))] rounded-2xl border border-[oklch(var(--c-line-soft))] shadow-sm",
        hover && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[oklch(var(--c-line))] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

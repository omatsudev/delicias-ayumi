import { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[oklch(var(--c-fg))]">
            {label}
          </label>
        )}
        <div className={cn(
          "flex items-center gap-2 rounded-xl border bg-[oklch(var(--c-surface))] px-3 py-2.5 transition-colors",
          error
            ? "border-[oklch(var(--c-danger))]"
            : "border-[oklch(var(--c-line))] focus-within:border-[oklch(var(--c-primary))]"
        )}>
          {prefix && <span className="text-[oklch(var(--c-fg-muted))] shrink-0">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 bg-transparent text-sm text-[oklch(var(--c-fg))] placeholder:text-[oklch(var(--c-fg-muted))] outline-none",
              className
            )}
            {...props}
          />
          {suffix && <span className="text-[oklch(var(--c-fg-muted))] shrink-0">{suffix}</span>}
        </div>
        {error && <p className="text-xs text-[oklch(var(--c-danger))]">{error}</p>}
        {hint && !error && <p className="text-xs text-[oklch(var(--c-fg-muted))]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[oklch(var(--c-fg))]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-xl border bg-[oklch(var(--c-surface))] px-3 py-2.5 text-sm text-[oklch(var(--c-fg))] placeholder:text-[oklch(var(--c-fg-muted))] outline-none transition-colors resize-none",
            error
              ? "border-[oklch(var(--c-danger))]"
              : "border-[oklch(var(--c-line))] focus:border-[oklch(var(--c-primary))]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[oklch(var(--c-danger))]">{error}</p>}
        {hint && !error && <p className="text-xs text-[oklch(var(--c-fg-muted))]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[oklch(var(--c-fg))]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-xl border bg-[oklch(var(--c-surface))] px-3 py-2.5 text-sm text-[oklch(var(--c-fg))] outline-none transition-colors cursor-pointer",
            error
              ? "border-[oklch(var(--c-danger))]"
              : "border-[oklch(var(--c-line))] focus:border-[oklch(var(--c-primary))]",
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-[oklch(var(--c-danger))]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

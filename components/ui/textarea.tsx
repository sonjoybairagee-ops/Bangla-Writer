import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  showCount?: boolean;
  maxCount?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, showCount, maxCount, ...props }, ref) => {
    const [count, setCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {showCount && (
            <p className={cn(
              "text-xs text-slate-500 ml-auto",
              maxCount && count > maxCount && "text-red-500"
            )}>
              {count}{maxCount && `/${maxCount}`}
            </p>
          )}
        </div>
      </div>
    );
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

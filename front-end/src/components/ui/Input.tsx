import * as React from 'react'

import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = 'text', ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // Loomi input: white surface, hairline border, 8px radius, no shadow. design.md §Inputs.
          'flex h-12 w-full rounded-md border border-input bg-surface px-5 py-3 text-sm font-light text-foreground transition-colors',
          'placeholder:text-foreground/35',
          'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          className,
        )}
        {...props}
      />
    )
  },
)

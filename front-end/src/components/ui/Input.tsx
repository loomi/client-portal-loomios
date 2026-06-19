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
          // Loomi (Light) — white surface, 0.12 border, 8px radius, no shadow.
          'flex h-12 w-full rounded-lg border border-input bg-card px-5 py-3.5 text-sm text-foreground transition-colors',
          'placeholder:text-[rgba(19,19,19,0.35)]',
          'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          className,
        )}
        {...props}
      />
    )
  },
)

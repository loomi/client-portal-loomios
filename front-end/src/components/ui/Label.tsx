import * as React from 'react'

import { cn } from '@/lib/utils'

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  function Label({ className, ...props }, ref) {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(
          // label-caps — uppercase, tracked, Regular weight
          'text-[0.6875rem] font-normal uppercase leading-none tracking-[0.15em] text-foreground/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)

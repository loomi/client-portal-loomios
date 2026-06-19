import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Loomi (Light) — translucent accent fill (10%), matching border (30%),
// solid accent text. Pill radius, label-caps typography.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-3.5 py-1.5 text-[0.625rem] font-normal uppercase tracking-[0.15em] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-primary",
        purple: "border-primary/30 bg-primary/10 text-primary",
        pink: "border-[var(--color-brand-pink)]/30 bg-[var(--color-brand-pink)]/10 text-[var(--color-brand-pink)]",
        secondary: "border-foreground/10 bg-muted text-muted-foreground",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
        outline: "border-foreground/20 text-foreground [a]:hover:bg-muted",
        ghost: "border-transparent text-muted-foreground hover:bg-muted",
        link: "border-transparent text-primary normal-case tracking-normal underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

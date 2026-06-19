import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Loomi badges: translucent accent fill (10%) + accent border (30%) +
// solid accent text. Pill + label-caps. design.md §Badges.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-3 py-1 text-[0.625rem] font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-brand-purple/30 bg-brand-purple/10 text-brand-purple",
        purple: "border-brand-purple/30 bg-brand-purple/10 text-brand-purple",
        pink: "border-brand-pink/30 bg-brand-pink/10 text-brand-pink",
        neutral: "border-foreground/15 bg-foreground/[0.04] text-foreground/70",
        outline: "border-foreground/20 text-foreground",
        // Health / journey states
        ok: "border-state-ok/30 bg-state-ok/10 text-[#157A4C]",
        attention: "border-state-attention/30 bg-state-attention/12 text-[#8A5A12]",
        blocked: "border-state-blocked/30 bg-state-blocked/10 text-[#C0292E]",
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

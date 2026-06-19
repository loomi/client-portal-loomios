import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Loomi buttons: pill radius, label-caps typography (uppercase + tracked),
// depth through lift (translateY) not shadow. design.md §Buttons.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent text-[0.6875rem] font-medium tracking-[0.18em] uppercase whitespace-nowrap transition-all outline-none select-none hover:-translate-y-px active:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary action on a light ground — highest contrast (near-black).
        default: "bg-brand-dark text-white hover:bg-black",
        purple: "bg-brand-purple text-white hover:bg-[#6A32E0]",
        pink: "bg-brand-pink text-white hover:bg-[#E61F75]",
        outline:
          "border-[rgba(19,19,19,0.2)] bg-transparent text-foreground hover:border-foreground/40 hover:bg-foreground/[0.03]",
        ghost: "text-foreground hover:bg-foreground/[0.05]",
        destructive: "bg-destructive text-white hover:bg-[#D33A3F]",
        // Inline text link — the one place we drop the caps treatment.
        link: "text-brand-purple tracking-normal normal-case underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-7",
        sm: "h-9 px-5 text-[0.625rem] tracking-[0.16em]",
        lg: "h-12 px-9",
        icon: "size-11 px-0",
        "icon-sm": "size-9 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

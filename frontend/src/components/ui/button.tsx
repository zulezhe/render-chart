import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn, styles } from "@/lib/utils"

const buttonVariants = cva(
  styles.button.base,
  {
    variants: {
      variant: {
        default: styles.button.variants.default,
        destructive: styles.button.variants.destructive,
        outline: styles.button.variants.outline,
        secondary: styles.button.variants.secondary,
        ghost: styles.button.variants.ghost,
        link: styles.button.variants.link,
      },
      size: {
        default: styles.button.sizes.default,
        sm: styles.button.sizes.sm,
        lg: styles.button.sizes.lg,
        icon: styles.button.sizes.icon,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
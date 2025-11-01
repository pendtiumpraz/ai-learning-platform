import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus-visible:ring-blue-500 shadow-lg hover:shadow-xl",
        destructive: "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus-visible:ring-red-500 shadow-lg hover:shadow-xl",
        outline: "border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus-visible:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 focus-visible:ring-gray-500 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500",
        ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus-visible:ring-green-500 shadow-lg hover:shadow-xl",
        warning: "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 focus-visible:ring-amber-500 shadow-lg hover:shadow-xl",
        info: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus-visible:ring-cyan-500 shadow-lg hover:shadow-xl",
        premium: "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 focus-visible:ring-amber-500 shadow-lg hover:shadow-xl animate-pulse",
        gamification: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-red-700 focus-visible:ring-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-xl"
      },
      animation: {
        none: "",
        bounce: "hover:animate-bounce",
        pulse: "animate-pulse",
        spin: "hover:animate-spin",
        wiggle: "hover:animate-wiggle"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, loading, success, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {success && (
          <svg
            className="mr-2 h-4 w-4 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
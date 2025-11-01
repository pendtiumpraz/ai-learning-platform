import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        outline: "border-gray-300 text-gray-700 hover:border-gray-400 focus-visible:ring-gray-500 dark:border-gray-600 dark:text-gray-300",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
        warning: "border-transparent bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500",
        info: "border-transparent bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-cyan-500",
        premium: "border-transparent bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 focus-visible:ring-amber-500 shadow-md",
        xp: "border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus-visible:ring-purple-500 shadow-md",
        level: "border-transparent bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 focus-visible:ring-indigo-500 shadow-md",
        achievement: "border-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus-visible:ring-green-500 shadow-md",
        skill: "border-transparent bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 focus-visible:ring-orange-500 shadow-md"
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-2 text-sm",
        xl: "px-6 py-3 text-base"
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        glow: "animate-glow"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, animation, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, animation }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
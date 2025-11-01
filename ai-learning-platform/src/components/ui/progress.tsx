import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gray-200 dark:bg-gray-700",
        success: "bg-green-100 dark:bg-green-900",
        warning: "bg-amber-100 dark:bg-amber-900",
        danger: "bg-red-100 dark:bg-red-900",
        info: "bg-cyan-100 dark:bg-cyan-900",
        xp: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900",
        skill: "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900",
        achievement: "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900",
        level: "bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900"
      },
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600",
        success: "bg-gradient-to-r from-green-600 to-emerald-600",
        warning: "bg-gradient-to-r from-amber-600 to-orange-600",
        danger: "bg-gradient-to-r from-red-600 to-pink-600",
        info: "bg-gradient-to-r from-cyan-600 to-blue-600",
        xp: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600",
        skill: "bg-gradient-to-r from-orange-600 to-red-600",
        achievement: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600",
        level: "bg-gradient-to-r from-indigo-600 to-blue-600"
      },
      animated: {
        none: "",
        shimmer: "animate-shimmer",
        glow: "animate-glow",
        pulse: "animate-pulse"
      }
    },
    defaultVariants: {
      variant: "default",
      animated: "none"
    }
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  showLabel?: boolean
  labelPosition?: "top" | "bottom" | "left" | "right"
  labelFormat?: "percentage" | "fraction" | "custom"
  customLabel?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value,
  variant,
  size,
  animated,
  showLabel = false,
  labelPosition = "top",
  labelFormat = "percentage",
  customLabel,
  ...props
}, ref) => {
  const progressValue = value || 0

  const getLabel = () => {
    if (labelFormat === "custom" && customLabel) return customLabel
    if (labelFormat === "fraction") return `${progressValue}%`
    return `${Math.round(progressValue)}%`
  }

  const labelElement = (
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {getLabel()}
    </span>
  )

  const progressElement = (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ variant, animated }))}
        style={{ transform: `translateX(-${100 - (progressValue || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )

  if (!showLabel) return progressElement

  const labelClasses = {
    top: "flex flex-col space-y-2",
    bottom: "flex flex-col space-y-2",
    left: "flex items-center space-x-3",
    right: "flex items-center space-x-3 flex-row-reverse"
  }

  return (
    <div className={labelClasses[labelPosition]}>
      {(labelPosition === "top" || labelPosition === "left") && labelElement}
      {progressElement}
      {(labelPosition === "bottom" || labelPosition === "right") && labelElement}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
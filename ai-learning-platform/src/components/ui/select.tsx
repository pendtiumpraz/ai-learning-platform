import * as React from "react"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
  value?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, value, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer ${className || ''}`}
          ref={ref}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return (
    <div className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background items-center justify-between ${className}`}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  )
}

interface SelectValueProps {
  placeholder?: string
  value?: string
}

export function SelectValue({ placeholder, value }: SelectValueProps) {
  return <span>{value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  return <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className}`}>{children}</div>
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ children, className }: SelectItemProps) {
  return (
    <div className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}>
      {children}
    </div>
  )
}

export { Select }
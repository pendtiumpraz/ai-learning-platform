// UI Library Type Declarations
// This file provides type definitions for Radix UI and other UI libraries

import { ComponentType, ReactNode, HTMLAttributes } from 'react';

// Radix UI Slot
declare module '@radix-ui/react-slot' {
  export interface SlotProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
  }

  export const Slot: ComponentType<SlotProps>;
}

// Radix UI Switch
declare module '@radix-ui/react-switch' {
  export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    id?: string;
    children?: ReactNode;
    asChild?: boolean;
  }

  export const Switch: ComponentType<SwitchProps>;
}

// Radix UI Slider
declare module '@radix-ui/react-slider' {
  export interface SliderProps {
    name?: string;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    min?: number;
    max?: number;
    step?: number;
    minStepsBetweenThumbs?: number;
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    onValueCommit?: (value: number[]) => void;
    inverted?: boolean;
    id?: string;
    children?: ReactNode;
    asChild?: boolean;
  }

  export const Slider: ComponentType<SliderProps>;
}

// Radix UI Progress
declare module '@radix-ui/react-progress' {
  export interface ProgressProps {
    value?: number;
    max?: number;
    getValueLabel?: (value: number, max: number) => string;
    children?: ReactNode;
    asChild?: boolean;
  }

  export const Progress: ComponentType<ProgressProps>;
}

// React Hook Form Resolvers
declare module '@hookform/resolvers' {
  export interface ResolverOptions {
    values: any;
    fields: any;
    context?: any;
  }

  export interface ResolverResult {
    values: any;
    errors: any;
  }

  export interface Resolver {
    (values: any, context: any, options: ResolverOptions): Promise<ResolverResult>;
  }

  export function zodResolver(schema: any): Resolver;
}

// React Syntax Highlighter
declare module 'react-syntax-highlighter' {
  export interface SyntaxHighlighterProps {
    language: string;
    children: string;
    style?: any;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    lineProps?: (lineNumber: number) => any;
    lineNumberStyle?: any;
    startingLineNumber?: number;
    PreTag?: ComponentType<any>;
    CodeTag?: ComponentType<any>;
    useStyleTag?: boolean;
    customStyle?: any;
    codeTagProps?: any;
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: any;
  export const Dark: any;
}

// React Markdown
declare module 'react-markdown' {
  export interface ReactMarkdownProps {
    children: string;
    components?: {
      [key: string]: ComponentType<any>;
    };
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    skipHtml?: boolean;
    unwrapDisallowed?: boolean;
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element;
}

// Remark GFM
declare module 'remark-gfm' {
  const plugin: any;
  export default plugin;
}

// Lucide React Icons
declare module 'lucide-react' {
  export interface LucideIconProps extends HTMLAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  }

  export const AlertCircle: ComponentType<LucideIconProps>;
  export const AlertTriangle: ComponentType<LucideIconProps>;
  export const ArrowDown: ComponentType<LucideIconProps>;
  export const ArrowLeft: ComponentType<LucideIconProps>;
  export const ArrowRight: ComponentType<LucideIconProps>;
  export const ArrowUp: ComponentType<LucideIconProps>;
  export const Award: ComponentType<LucideIconProps>;
  export const BarChart: ComponentType<LucideIconProps>;
  export const Bell: ComponentType<LucideIconProps>;
  export const Book: ComponentType<LucideIconProps>;
  export const BookOpen: ComponentType<LucideIconProps>;
  export const Brain: ComponentType<LucideIconProps>;
  export const Calendar: ComponentType<LucideIconProps>;
  export const Check: ComponentType<LucideIconProps>;
  export const ChevronDown: ComponentType<LucideIconProps>;
  export const ChevronLeft: ComponentType<LucideIconProps>;
  export const ChevronRight: ComponentType<LucideIconProps>;
  export const ChevronUp: ComponentType<LucideIconProps>;
  export const Clock: ComponentType<LucideIconProps>;
  export const Code: ComponentType<LucideIconProps>;
  export const Coffee: ComponentType<LucideIconProps>;
  export const Cog: ComponentType<LucideIconProps>;
  export const Copy: ComponentType<LucideIconProps>;
  export const Database: ComponentType<LucideIconProps>;
  export const Download: ComponentType<LucideIconProps>;
  export const Edit: ComponentType<LucideIconProps>;
  export const Eye: ComponentType<LucideIconProps>;
  export const EyeOff: ComponentType<LucideIconProps>;
  export const File: ComponentType<LucideIconProps>;
  export const Filter: ComponentType<LucideIconProps>;
  export const Flame: ComponentType<LucideIconProps>;
  export const Gift: ComponentType<LucideIconProps>;
  export const Globe: ComponentType<LucideIconProps>;
  export const Hash: ComponentType<LucideIconProps>;
  export const HelpCircle: ComponentType<LucideIconProps>;
  export const Home: ComponentType<LucideIconProps>;
  export const Info: ComponentType<LucideIconProps>;
  export const Layers: ComponentType<LucideIconProps>;
  export const Layout: ComponentType<LucideIconProps>;
  export const Loader: ComponentType<LucideIconProps>;
  export const Lock: ComponentType<LucideIconProps>;
  export const Mail: ComponentType<LucideIconProps>;
  export const Menu: ComponentType<LucideIconProps>;
  export const MessageSquare: ComponentType<LucideIconProps>;
  export const Minus: ComponentType<LucideIconProps>;
  export const MoreHorizontal: ComponentType<LucideIconProps>;
  export const MoreVertical: ComponentType<LucideIconProps>;
  export const Pause: ComponentType<LucideIconProps>;
  export const Play: ComponentType<LucideIconProps>;
  export const Plus: ComponentType<LucideIconProps>;
  export const RefreshCw: ComponentType<LucideIconProps>;
  export const Save: ComponentType<LucideIconProps>;
  export const Search: ComponentType<LucideIconProps>;
  export const Settings: ComponentType<LucideIconProps>;
  export const Share: ComponentType<LucideIconProps>;
  export const Star: ComponentType<LucideIconProps>;
  export const Target: ComponentType<LucideIconProps>;
  export const Trash: ComponentType<LucideIconProps>;
  export const Trash2: ComponentType<LucideIconProps>;
  export const Trophy: ComponentType<LucideIconProps>;
  export const Undo: ComponentType<LucideIconProps>;
  export const User: ComponentType<LucideIconProps>;
  export const Users: ComponentType<LucideIconProps>;
  export const X: ComponentType<LucideIconProps>;
  export const XCircle: ComponentType<LucideIconProps>;
  export const Zap: ComponentType<LucideIconProps>;
  export const Redo: ComponentType<LucideIconProps>;
  export const Bug: ComponentType<LucideIconProps>;

  // Add any other icons as needed
}

// React Query (TanStack Query)
declare module '@tanstack/react-query' {
  export interface QueryOptions {
    queryKey: any[];
    queryFn: () => Promise<any>;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number;
    retry?: number;
    retryDelay?: number;
  }

  export interface MutationOptions {
    mutationFn: () => Promise<any>;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onSettled?: () => void;
  }

  export interface UseQueryResult<T> {
    data: T | undefined;
    error: any;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    refetch: () => void;
  }

  export const useQuery: <T>(options: QueryOptions) => UseQueryResult<T>;
  export const useMutation: <T>(options: MutationOptions) => any;
  export const QueryClient: any;
  export const QueryClientProvider: ComponentType<{ client: any; children: ReactNode }>;
}

// Next Themes
declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }

  export const ThemeProvider: ComponentType<ThemeProviderProps>;
  export const useTheme: () => {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    systemTheme: string;
    forcedTheme: string | undefined;
    resolvedTheme: string | undefined;
  };
}

// React Confetti
declare module 'react-confetti' {
  export interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    run?: boolean;
    gravity?: number;
    initialVelocityX?: number;
    initialVelocityY?: number;
    wind?: number;
    colors?: string[];
    opacity?: number;
    drawShape?: (ctx: CanvasRenderingContext2D, shape: any) => void;
    onConfettiComplete?: () => void;
  }

  export default function Confetti(props: ConfettiProps): JSX.Element;
}

// Recharts
declare module 'recharts' {
  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children: ReactNode;
  }

  export interface BarChartProps {
    data: any[];
    children: ReactNode;
  }

  export interface LineChartProps {
    data: any[];
    children: ReactNode;
  }

  export interface PieChartProps {
    data: any[];
    children: ReactNode;
  }

  export interface XAxisProps {
    dataKey?: string;
    stroke?: string;
    tick?: any;
  }

  export interface YAxisProps {
    stroke?: string;
    tick?: any;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface TooltipProps {
    content?: ComponentType<any>;
    cursor?: boolean;
  }

  export interface LegendProps {
    content?: ComponentType<any>;
  }

  export interface BarProps {
    dataKey: string;
    fill?: string;
    stroke?: string;
  }

  export interface LineProps {
    type?: string;
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface PieProps {
    dataKey: string;
    fill?: string;
    stroke?: string;
  }

  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const BarChart: ComponentType<BarChartProps>;
  export const LineChart: ComponentType<LineChartProps>;
  export const PieChart: ComponentType<PieChartProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
  export const Bar: ComponentType<BarProps>;
  export const Line: ComponentType<LineProps>;
  export const Pie: ComponentType<PieProps>;
}

// Date Fns
declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string): string;
  export function addDays(date: Date | number, amount: number): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function addHours(date: Date | number, amount: number): Date;
  export function subHours(date: Date | number, amount: number): Date;
  export function addMinutes(date: Date | number, amount: number): Date;
  export function subMinutes(date: Date | number, amount: number): Date;
  export function startOfDay(date: Date | number): Date;
  export function endOfDay(date: Date | number): Date;
  export function isToday(date: Date | number): boolean;
  export function isYesterday(date: Date | number): boolean;
  export function differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInHours(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMinutes(dateLeft: Date | number, dateRight: Date | number): number;
}
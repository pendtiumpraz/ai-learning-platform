// Framer Motion Module Declaration
// This fixes the import issues for Framer Motion components

declare module 'framer-motion' {
  import { ComponentType, ReactNode, RefObject } from 'react';

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    whileHover?: any;
    whileTap?: any;
    variants?: any;
    transition?: any;
    layout?: boolean;
    layoutId?: string;
    drag?: boolean | 'x' | 'y';
    dragConstraints?: any;
    onDragStart?: (event: any, info: any) => void;
    onDrag?: (event: any, info: any) => void;
    onDragEnd?: (event: any, info: any) => void;
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    whileInView?: any;
    viewport?: any;
    [key: string]: any;
  }

  export interface AnimatePresenceProps {
    children?: ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
    presenceAffectsLayout?: boolean;
  }

  export const motion: {
    div: ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: ComponentType<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    button: ComponentType<MotionProps & React.HTMLAttributes<HTMLButtonElement>>;
    h1: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    h2: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    h3: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    h4: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    h5: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    h6: ComponentType<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
    p: ComponentType<MotionProps & React.HTMLAttributes<HTMLParagraphElement>>;
    section: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    article: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    header: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    footer: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    main: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    form: ComponentType<MotionProps & React.HTMLAttributes<HTMLFormElement>>;
    li: ComponentType<MotionProps & React.HTMLAttributes<HTMLLIElement>>;
    ul: ComponentType<MotionProps & React.HTMLAttributes<HTMLUListElement>>;
    ol: ComponentType<MotionProps & React.HTMLAttributes<HTMLOListElement>>;
    img: ComponentType<MotionProps & React.HTMLAttributes<HTMLImageElement>>;
    input: ComponentType<MotionProps & React.HTMLAttributes<HTMLInputElement>>;
    label: ComponentType<MotionProps & React.HTMLAttributes<HTMLLabelElement>>;
    nav: ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    [key: string]: ComponentType<any>;
  };

  export const AnimatePresence: ComponentType<AnimatePresenceProps>;

  export const useAnimation: () => any;
  export const useMotionValue: <T>(initial: T) => any;
  export const useScroll: (options?: any) => any;
  export const useInView: (ref: RefObject<HTMLElement>, options?: any) => boolean;
  export const useReducedMotion: () => boolean;
  export const useTransform: <I, O>(value: any, transformer: (input: I) => O) => any;
  export const useSpring: (source: any, config?: any) => any;

  // Export as default for compatibility
  export default motion;
}
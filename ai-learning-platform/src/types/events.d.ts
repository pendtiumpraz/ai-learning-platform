// Event Handler and Callback Type Declarations
// This file provides comprehensive type definitions for all event handlers and callbacks

import { MouseEvent, ChangeEvent, FormEvent, KeyboardEvent, FocusEvent, DragEvent, WheelEvent } from 'react';

// Generic Event Handler Types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;
export type EventHandlerWithCallback<T = Event, R = void> = (event: T, callback?: (result: R) => void) => void;
export type EventPredicate<T = Event> = (event: T) => boolean;

// Mouse Events
export type MouseEventHandler = EventHandler<MouseEvent>;
export type AsyncMouseEventHandler = AsyncEventHandler<MouseEvent>;
export type MouseEventHandlerWithCallback<T> = EventHandlerWithCallback<MouseEvent, T>;

// Click Events
export type ClickHandler = (event: MouseEvent<HTMLButtonElement>) => void;
export type AsyncClickHandler = (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
export type ClickHandlerWithData<T> = (event: MouseEvent<HTMLButtonElement>, data: T) => void;
export type ClickHandlerWithCallback<T> = (event: MouseEvent<HTMLButtonElement>, callback: (result: T) => void) => void;

// Double Click Events
export type DoubleClickHandler = (event: MouseEvent<HTMLElement>) => void;
export type AsyncDoubleClickHandler = (event: MouseEvent<HTMLElement>) => Promise<void>;
export type DoubleClickHandlerWithData<T> = (event: MouseEvent<HTMLElement>, data: T) => void;

// Right Click Events
export type ContextMenuHandler = (event: MouseEvent<HTMLElement>) => void;
export type AsyncContextMenuHandler = (event: MouseEvent<HTMLElement>) => Promise<void>;
export type ContextMenuHandlerWithData<T> = (event: MouseEvent<HTMLElement>, data: T) => void;

// Change Events
export type ChangeHandler<T = HTMLInputElement> = (event: ChangeEvent<T>) => void;
export type AsyncChangeHandler<T = HTMLInputElement> = (event: ChangeEvent<T>) => Promise<void>;
export type ChangeHandlerWithValue<T = HTMLInputElement, R = string> = (event: ChangeEvent<T>, value: R) => void;
export type ChangeHandlerWithCallback<T = HTMLInputElement, R = string> = (event: ChangeEvent<T>, callback: (value: R) => void) => void;

// Input Events
export type InputHandler = (event: FormEvent<HTMLInputElement>) => void;
export type AsyncInputHandler = (event: FormEvent<HTMLInputElement>) => Promise<void>;
export type InputHandlerWithValue = (event: FormEvent<HTMLInputElement>, value: string) => void;
export type InputHandlerWithCallback<T> = (event: FormEvent<HTMLInputElement>, callback: (value: string) => void) => void;

// Form Events
export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;
export type AsyncFormSubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;
export type FormSubmitHandlerWithData<T> = (event: FormEvent<HTMLFormElement>, data: T) => void;
export type FormSubmitHandlerWithCallback<T> = (event: FormEvent<HTMLFormElement>, callback: (data: T) => void) => void;

export type FormChangeHandler = (event: FormEvent<HTMLFormElement>) => void;
export type AsyncFormChangeHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;
export type FormChangeHandlerWithData<T> = (event: FormEvent<HTMLFormElement>, data: T) => void;

// Keyboard Events
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;
export type AsyncKeyboardEventHandler = AsyncEventHandler<KeyboardEvent>;
export type KeyboardHandlerWithData<T> = (event: KeyboardEvent, data: T) => void;
export type KeyboardHandlerWithCallback<T> = (event: KeyboardEvent, callback: (data: T) => void) => void;

// Key Press Events
export type KeyPressHandler = (event: KeyboardEvent, key: string) => void;
export type AsyncKeyPressHandler = (event: KeyboardEvent, key: string) => Promise<void>;
export type KeyPressHandlerWithData<T> = (event: KeyboardEvent, key: string, data: T) => void;

// Focus Events
export type FocusHandler = (event: FocusEvent<HTMLElement>) => void;
export type AsyncFocusHandler = (event: FocusEvent<HTMLElement>) => Promise<void>;
export type FocusHandlerWithData<T> = (event: FocusEvent<HTMLElement>, data: T) => void;

export type BlurHandler = (event: FocusEvent<HTMLElement>) => void;
export type AsyncBlurHandler = (event: FocusEvent<HTMLElement>) => Promise<void>;
export type BlurHandlerWithData<T> = (event: FocusEvent<HTMLElement>, data: T) => void;

// Drag and Drop Events
export type DragStartHandler = (event: DragEvent<HTMLElement>) => void;
export type AsyncDragStartHandler = (event: DragEvent<HTMLElement>) => Promise<void>;
export type DragStartHandlerWithData<T> = (event: DragEvent<HTMLElement>, data: T) => void;

export type DragEndHandler = (event: DragEvent<HTMLElement>) => void;
export type AsyncDragEndHandler = (event: DragEvent<HTMLElement>) => Promise<void>;
export type DragEndHandlerWithData<T> = (event: DragEvent<HTMLElement>, data: T) => void;

export type DragOverHandler = (event: DragEvent<HTMLElement>) => void;
export type AsyncDragOverHandler = (event: DragEvent<HTMLElement>) => Promise<void>;
export type DragOverHandlerWithData<T> = (event: DragEvent<HTMLElement>, data: T) => void;

export type DropHandler = (event: DragEvent<HTMLElement>) => void;
export type AsyncDropHandler = (event: DragEvent<HTMLElement>) => Promise<void>;
export type DropHandlerWithData<T> = (event: DragEvent<HTMLElement>, data: T) => void;

// Scroll Events
export type ScrollHandler = (event: Event) => void;
export type AsyncScrollHandler = (event: Event) => Promise<void>;
export type ScrollHandlerWithData<T> = (event: Event, data: T) => void;
export type ScrollHandlerWithPosition = (event: Event, position: { x: number; y: number }) => void;

// Wheel Events
export type WheelHandler = (event: WheelEvent<HTMLElement>) => void;
export type AsyncWheelHandler = (event: WheelEvent<HTMLElement>) => Promise<void>;
export type WheelHandlerWithData<T> = (event: WheelEvent<HTMLElement>, data: T) => void;

// Touch Events
export type TouchStartHandler = (event: TouchEvent<HTMLElement>) => void;
export type AsyncTouchStartHandler = (event: TouchEvent<HTMLElement>) => Promise<void>;
export type TouchStartHandlerWithData<T> = (event: TouchEvent<HTMLElement>, data: T) => void;

export type TouchMoveHandler = (event: TouchEvent<HTMLElement>) => void;
export type AsyncTouchMoveHandler = (event: TouchEvent<HTMLElement>) => Promise<void>;
export type TouchMoveHandlerWithData<T> = (event: TouchEvent<HTMLElement>, data: T) => void;

export type TouchEndHandler = (event: TouchEvent<HTMLElement>) => void;
export type AsyncTouchEndHandler = (event: TouchEvent<HTMLElement>) => Promise<void>;
export type TouchEndHandlerWithData<T> = (event: TouchEvent<HTMLElement>, data: T) => void;

// ReactFlow Event Handlers
export type ReactFlowNodeClickHandler = (event: MouseEvent, node: any) => void;
export type AsyncReactFlowNodeClickHandler = (event: MouseEvent, node: any) => Promise<void>;
export type ReactFlowNodeClickHandlerWithData<T> = (event: MouseEvent, node: any, data: T) => void;

export type ReactFlowEdgeClickHandler = (event: MouseEvent, edge: any) => void;
export type AsyncReactFlowEdgeClickHandler = (event: MouseEvent, edge: any) => Promise<void>;
export type ReactFlowEdgeClickHandlerWithData<T> = (event: MouseEvent, edge: any, data: T) => void;

export type ReactFlowPaneClickHandler = (event: MouseEvent) => void;
export type AsyncReactFlowPaneClickHandler = (event: MouseEvent) => Promise<void>;
export type ReactFlowPaneClickHandlerWithData<T> = (event: MouseEvent, data: T) => void;

export type ReactFlowConnectionHandler = (connection: any) => void;
export type AsyncReactFlowConnectionHandler = (connection: any) => Promise<void>;
export type ReactFlowConnectionHandlerWithData<T> = (connection: any, data: T) => void;

// File Event Handlers
export type FileSelectHandler = (event: ChangeEvent<HTMLInputElement>) => void;
export type AsyncFileSelectHandler = (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
export type FileSelectHandlerWithFiles = (event: ChangeEvent<HTMLInputElement>, files: FileList | null) => void;
export type FileSelectHandlerWithCallback = (event: ChangeEvent<HTMLInputElement>, callback: (files: File[]) => void) => void;

export type FileDropHandler = (event: DragEvent<HTMLElement>, files: FileList) => void;
export type AsyncFileDropHandler = (event: DragEvent<HTMLElement>, files: FileList) => Promise<void>;
export type FileDropHandlerWithCallback = (event: DragEvent<HTMLElement>, files: FileList, callback: (results: any[]) => void) => void;

// Media Event Handlers
export type MediaPlayHandler = (event: Event) => void;
export type AsyncMediaPlayHandler = (event: Event) => Promise<void>;
export type MediaPlayHandlerWithData<T> = (event: Event, data: T) => void;

export type MediaPauseHandler = (event: Event) => void;
export type AsyncMediaPauseHandler = (event: Event) => Promise<void>;
export type MediaPauseHandlerWithData<T> = (event: Event, data: T) => void;

export type MediaEndedHandler = (event: Event) => void;
export type AsyncMediaEndedHandler = (event: Event) => Promise<void>;
export type MediaEndedHandlerWithData<T> = (event: Event, data: T) => void;

export type MediaTimeUpdateHandler = (event: Event, currentTime: number) => void;
export type AsyncMediaTimeUpdateHandler = (event: Event, currentTime: number) => Promise<void>;
export type MediaTimeUpdateHandlerWithData<T> = (event: Event, currentTime: number, data: T) => void;

// Window Event Handlers
export type WindowResizeHandler = (event: Event) => void;
export type AsyncWindowResizeHandler = (event: Event) => Promise<void>;
export type WindowResizeHandlerWithDimensions = (event: Event, dimensions: { width: number; height: number }) => void;

export type WindowScrollHandler = (event: Event) => void;
export type AsyncWindowScrollHandler = (event: Event) => Promise<void>;
export type WindowScrollHandlerWithPosition = (event: Event, position: { x: number; y: number }) => void;

export type WindowOnlineHandler = (event: Event) => void;
export type AsyncWindowOnlineHandler = (event: Event) => Promise<void>;

export type WindowOfflineHandler = (event: Event) => void;
export type AsyncWindowOfflineHandler = (event: Event) => Promise<void>;

// Error Event Handlers
export type ErrorHandler = (event: ErrorEvent) => void;
export type AsyncErrorHandler = (event: ErrorEvent) => Promise<void>;
export type ErrorHandlerWithCallback = (event: ErrorEvent, callback: (handled: boolean) => void) => void;

export type UnhandledRejectionHandler = (event: PromiseRejectionEvent) => void;
export type AsyncUnhandledRejectionHandler = (event: PromiseRejectionEvent) => Promise<void>;
export type UnhandledRejectionHandlerWithCallback = (event: PromiseRejectionEvent, callback: (handled: boolean) => void) => void;

// Lifecycle Event Handlers
export type LoadHandler = (event: Event) => void;
export type AsyncLoadHandler = (event: Event) => Promise<void>;
export type LoadHandlerWithCallback = (event: Event, callback: () => void) => void;

export type UnloadHandler = (event: BeforeUnloadEvent) => void;
export type AsyncUnloadHandler = (event: BeforeUnloadEvent) => Promise<void>;
export type UnloadHandlerWithCallback = (event: BeforeUnloadEvent, callback: () => void) => void;

// WebSocket Event Handlers
export type WebSocketOpenHandler = (event: Event) => void;
export type AsyncWebSocketOpenHandler = (event: Event) => Promise<void>;
export type WebSocketOpenHandlerWithData<T> = (event: Event, data: T) => void;

export type WebSocketMessageHandler = (event: MessageEvent) => void;
export type AsyncWebSocketMessageHandler = (event: MessageEvent) => Promise<void>;
export type WebSocketMessageHandlerWithData<T> = (event: MessageEvent, data: T) => void;

export type WebSocketCloseHandler = (event: CloseEvent) => void;
export type AsyncWebSocketCloseHandler = (event: CloseEvent) => Promise<void>;
export type WebSocketCloseHandlerWithData<T> = (event: CloseEvent, data: T) => void;

export type WebSocketErrorHandler = (event: Event) => void;
export type AsyncWebSocketErrorHandler = (event: Event) => Promise<void>;
export type WebSocketErrorHandlerWithData<T> = (event: Event, data: T) => void;

// Service Worker Event Handlers
export type ServiceWorkerInstallHandler = (event: ExtendableEvent) => void;
export type AsyncServiceWorkerInstallHandler = (event: ExtendableEvent) => Promise<void>;

export type ServiceWorkerActivateHandler = (event: ExtendableEvent) => void;
export type AsyncServiceWorkerActivateHandler = (event: ExtendableEvent) => Promise<void>;

export type ServiceWorkerFetchHandler = (event: FetchEvent) => void;
export type AsyncServiceWorkerFetchHandler = (event: FetchEvent) => Promise<void>;

export type ServiceWorkerMessageHandler = (event: ExtendableMessageEvent) => void;
export type AsyncServiceWorkerMessageHandler = (event: ExtendableMessageEvent) => Promise<void>;

// Request Event Handlers
export type RequestSuccessHandler<T = any> = (data: T) => void;
export type AsyncRequestSuccessHandler<T = any> = (data: T) => Promise<void>;
export type RequestSuccessHandlerWithCallback<T = any, R = void> = (data: T, callback: (result: R) => void) => void;

export type RequestErrorHandler = (error: Error) => void;
export type AsyncRequestErrorHandler = (error: Error) => Promise<void>;
export type RequestErrorHandlerWithCallback = (error: Error, callback: (handled: boolean) => void) => void;

export type RequestProgressHandler = (progress: { loaded: number; total: number }) => void;
export type AsyncRequestProgressHandler = (progress: { loaded: number; total: number }) => Promise<void>;

export type RequestTimeoutHandler = () => void;
export type AsyncRequestTimeoutHandler = () => Promise<void>;

// Animation Event Handlers
export type AnimationStartHandler = (event: AnimationEvent) => void;
export type AsyncAnimationStartHandler = (event: AnimationEvent) => Promise<void>;
export type AnimationStartHandlerWithData<T> = (event: AnimationEvent, data: T) => void;

export type AnimationEndHandler = (event: AnimationEvent) => void;
export type AsyncAnimationEndHandler = (event: AnimationEvent) => Promise<void>;
export type AnimationEndHandlerWithData<T> = (event: AnimationEvent, data: T) => void;

export type AnimationIterationHandler = (event: AnimationEvent) => void;
export type AsyncAnimationIterationHandler = (event: AnimationEvent) => Promise<void>;
export type AnimationIterationHandlerWithData<T> = (event: AnimationEvent, data: T) => void;

// Transition Event Handlers
export type TransitionStartHandler = (event: TransitionEvent) => void;
export type AsyncTransitionStartHandler = (event: TransitionEvent) => Promise<void>;
export type TransitionStartHandlerWithData<T> = (event: TransitionEvent, data: T) => void;

export type TransitionEndHandler = (event: TransitionEvent) => void;
export type AsyncTransitionEndHandler = (event: TransitionEvent) => Promise<void>;
export type TransitionEndHandlerWithData<T> = (event: TransitionEvent, data: T) => void;

export type TransitionCancelHandler = (event: TransitionEvent) => void;
export type AsyncTransitionCancelHandler = (event: TransitionEvent) => Promise<void>;
export type TransitionCancelHandlerWithData<T> = (event: TransitionEvent, data: T) => void;

// Intersection Observer Handlers
export type IntersectionHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
export type AsyncIntersectionHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => Promise<void>;
export type IntersectionHandlerWithData<T> = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, data: T) => void;

// Resize Observer Handlers
export type ResizeHandler = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
export type AsyncResizeHandler = (entries: ResizeObserverEntry[], observer: ResizeObserver) => Promise<void>;
export type ResizeHandlerWithData<T> = (entries: ResizeObserverEntry[], observer: ResizeObserver, data: T) => void;

// Mutation Observer Handlers
export type MutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => void;
export type AsyncMutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => Promise<void>;
export type MutationHandlerWithData<T> = (mutations: MutationRecord[], observer: MutationObserver, data: T) => void;

// Permission Event Handlers
export type PermissionChangeHandler = (event: Event, status: PermissionState) => void;
export type AsyncPermissionChangeHandler = (event: Event, status: PermissionState) => Promise<void>;
export type PermissionChangeHandlerWithData<T> = (event: Event, status: PermissionState, data: T) => void;

// Battery Event Handlers
export type BatteryChangeHandler = (event: Event, batteryInfo: BatteryManager) => void;
export type AsyncBatteryChangeHandler = (event: Event, batteryInfo: BatteryManager) => Promise<void>;
export type BatteryChangeHandlerWithData<T> = (event: Event, batteryInfo: BatteryManager, data: T) => void;

// Geolocation Event Handlers
export type GeolocationSuccessHandler = (position: GeolocationPosition) => void;
export type AsyncGeolocationSuccessHandler = (position: GeolocationPosition) => Promise<void>;
export type GeolocationSuccessHandlerWithData<T> = (position: GeolocationPosition, data: T) => void;

export type GeolocationErrorHandler = (error: GeolocationPositionError) => void;
export type AsyncGeolocationErrorHandler = (error: GeolocationPositionError) => Promise<void>;
export type GeolocationErrorHandlerWithData<T> = (error: GeolocationPositionError, data: T) => void;

// Device Orientation Event Handlers
export type DeviceOrientationHandler = (event: DeviceOrientationEvent) => void;
export type AsyncDeviceOrientationHandler = (event: DeviceOrientationEvent) => Promise<void>;
export type DeviceOrientationHandlerWithData<T> = (event: DeviceOrientationEvent, data: T) => void;

// Device Motion Event Handlers
export type DeviceMotionHandler = (event: DeviceMotionEvent) => void;
export type AsyncDeviceMotionHandler = (event: DeviceMotionEvent) => Promise<void>;
export type DeviceMotionHandlerWithData<T> = (event: DeviceMotionEvent, data: T) => void;

// Custom Event Handlers
export type CustomEventHandler<T = any> = (event: CustomEvent<T>) => void;
export type AsyncCustomEventHandler<T = any> = (event: CustomEvent<T>) => Promise<void>;
export type CustomEventHandlerWithCallback<T = any, R = void> = (event: CustomEvent<T>, callback: (result: R) => void) => void;

// Generic Callback Types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type CallbackWithParams<P = any, T = void> = (params: P) => T;
export type AsyncCallbackWithParams<P = any, T = void> = (params: P) => Promise<T>;
export type CallbackWithCallback<P = any, T = void, R = void> = (params: P, callback: (result: R) => void) => T;

// Utility Types for Event Handling
export type EventData<T> = {
  nativeEvent: Event;
  data: T;
  timestamp: Date;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export type EventListener<T = Event> = {
  handler: EventHandler<T>;
  once?: boolean;
  passive?: boolean;
  capture?: boolean;
};

export type EventManager<T = Event> = {
  addListener: (type: string, handler: EventHandler<T>) => void;
  removeListener: (type: string, handler: EventHandler<T>) => void;
  removeAllListeners: (type?: string) => void;
  emit: (type: string, event: T) => void;
  on: (type: string, handler: EventHandler<T>) => void;
  off: (type: string, handler: EventHandler<T>) => void;
};

// Debounced and Throttled Event Handlers
export type DebouncedEventHandler<T = Event> = {
  (event: T): void;
  cancel(): void;
  flush(): void;
};

export type ThrottledEventHandler<T = Event> = {
  (event: T): void;
  cancel(): void;
  flush(): void;
};

// Event Handler Utilities
export interface EventHandlerUtils {
  debounce<T = Event>(handler: EventHandler<T>, delay: number): DebouncedEventHandler<T>;
  throttle<T = Event>(handler: EventHandler<T>, delay: number): ThrottledEventHandler<T>;
  once<T = Event>(handler: EventHandler<T>): EventHandler<T>;
  preventDefault<T = Event>(handler: EventHandler<T>): EventHandler<T>;
  stopPropagation<T = Event>(handler: EventHandler<T>): EventHandler<T>;
  compose<T = Event>(...handlers: EventHandler<T>[]): EventHandler<T>;
  pipe<T = Event, R>(...handlers: Array<(arg: T | R) => R>): (event: T) => R;
}
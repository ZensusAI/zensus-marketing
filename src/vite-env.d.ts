/// <reference types="vite/client" />

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget(opts: { url: string }): void;
    };
  }
}

export {};

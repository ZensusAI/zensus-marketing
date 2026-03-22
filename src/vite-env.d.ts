/// <reference types="vite/client" />

interface Calendly {
  initPopupWidget(opts: { url: string }): void;
}

declare global {
  interface Window {
    Calendly?: Calendly;
  }
}

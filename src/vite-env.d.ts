/// <reference types="vite/client" />

// UnicornStudio type declarations
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

export {};

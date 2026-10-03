import { createContext, type RefObject } from 'react';

export type MotionMode = 'system' | 'full' | 'reduced';
export const GalleryPreferences = createContext<{ enabled: boolean; entranceDelay: RefObject<number> }>({ enabled: true, entranceDelay: { current: 0.4 } });

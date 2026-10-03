import { createContext } from 'react';

export const GalleryNavigation = createContext<((destination: string) => void) | null>(null);

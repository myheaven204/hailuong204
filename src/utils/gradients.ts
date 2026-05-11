export const GRADIENTS = {
  amberPrimary: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
  amberBright: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
  amberDark: 'linear-gradient(135deg, hsl(43 100% 35%), hsl(35 100% 40%))',
} as const;

export const gradientTextStyle = (gradient: string) => ({
  background: gradient,
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
});

export const COLOR_PALETTE = {
  amber: {
    50: 'hsl(43 100% 95%)',
    100: 'hsl(43 100% 90%)',
    500: 'hsl(43 100% 50%)',
    600: 'hsl(43 100% 46%)',
    700: 'hsl(43 100% 40%)',
  },
  emerald: {
    400: 'hsl(160 84% 39%)',
    500: 'hsl(160 84% 39%)',
  },
  slate: {
    900: 'hsl(217 33% 17%)',
    950: 'rgba(8,8,10,0.92)',
  },
  accent: {
    glow: 'rgba(232,164,0,0.2)',
    glowMedium: 'rgba(232,164,0,0.6)',
    glowLight: 'rgba(0,200,83,0.15)',
  },
} as const;

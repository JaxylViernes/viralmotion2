export interface TypographyConfig {
  id: string;
  words: string[];
  colors: KineticColors;
  timing:KineticTiming;
  effects: KineticEffects;
}

export type KineticColors = {
     primary: string;
    secondary: string;
    accent: string;
}

export type KineticTiming = {
    staggerDelay: number;
    collisionFrame: number;
    explosionDelay: number;
}

export type KineticEffects = {
    shakeIntensity: number;
    particleCount: number;
    ballSize: number;
}
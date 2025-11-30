import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from 'remotion';
import { z } from 'zod';

/* ------------------ types ------------------ */

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
}

export interface NeonTubeFlickerProps {
  title?: string;
  titleLines?: [string, string];
  durationInSeconds?: number;
  /** If omitted, we use studio fps from useVideoConfig() */
  fps?: number;
  palette?: Palette;
  grainIntensity?: number;
  scanlineOpacity?: number;
  glowStrength?: number;
  flickerEndAt?: number;
  breathingAmplitude?: number;
  letterSpacing?: number;
  safePadding?: number;
  showLogo?: boolean;
  seed?: number;
  /** Smooth settle time (seconds) after flicker */
  settleDuration?: number;
}

/* ------------------ schema ------------------ */

export const NeonTubeFlickerSchema = z.object({
  title: z.string().optional(),
  titleLines: z.tuple([z.string(), z.string()]).optional(),
  durationInSeconds: z.number().positive().optional(),
  fps: z.number().positive().optional(),
  palette: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      bgTop: z.string(),
      bgBottom: z.string(),
    })
    .optional(),
  grainIntensity: z.number().min(0).max(1).optional(),
  scanlineOpacity: z.number().min(0).max(1).optional(),
  glowStrength: z.number().min(0).optional(),
  flickerEndAt: z.number().min(0).optional(),
  breathingAmplitude: z.number().min(0).optional(),
  letterSpacing: z.number().optional(),
  safePadding: z.number().optional(),
  showLogo: z.boolean().optional(),
  seed: z.number().optional(),
  settleDuration: z.number().min(0).optional(),
}) satisfies z.ZodType<NeonTubeFlickerProps>;

/* ------------------ utilities ------------------ */

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Split title into exactly two lines.
const splitTitleToTwoLines = (title: string): [string, string] => {
  if (!title) return ['', ''];
  const explicitBreak = title.split(/\n|\|/).map((s) => s.trim()).filter(Boolean);
  if (explicitBreak.length >= 2) return [explicitBreak[0], explicitBreak.slice(1).join(' ')];

  const words = title.trim().split(/\s+/);
  if (words.length === 1) {
    const mid = Math.ceil(words[0].length / 2);
    return [words[0].slice(0, mid), words[0].slice(mid)];
  }

  let best: [string, string] = [title, ''];
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i).join(' ');
    const diff = Math.abs(line1.length - line2.length);
    if (diff < bestDiff) {
      best = [line1, line2];
      bestDiff = diff;
    }
  }
  return best;
};

interface LetterProps {
  char: string;
  index: number;
  seed: number;
  frame: number;
  fps: number;
  flickerEndAt: number;
  breathingAmplitude: number;
  palette: Palette;
  glowStrength: number;
  strokeColor: string;
  strokeSize: number;
  settleDuration: number;
}

/* ------------------ glow letters ------------------ */

const Letter: React.FC<LetterProps> = ({
  char,
  index,
  seed,
  frame,
  fps,
  flickerEndAt,
  breathingAmplitude,
  palette,
  glowStrength,
  strokeColor,
  strokeSize,
  settleDuration,
}) => {
  const currentTime = frame / fps;
  const flickerEndFrame = flickerEndAt * fps;
  const charSeed = seed + index * 997;

  let isOn = true;
  let jitterX = 0;
  let jitterY = 0;
  let jitterRotation = 0;

  if (currentTime < flickerEndAt) {
    const flickerDecay = interpolate(
      frame,
      [0, flickerEndFrame * 0.65, flickerEndFrame],
      [1, 0.6, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
    );

    const flickerFreq = 11 + seededRandom(charSeed + 1) * 7; // 11–18 Hz feel
    const flickerPhase = (frame * flickerFreq) / fps;
    const n1 = seededRandom(charSeed + Math.floor(flickerPhase) * 13);
    const n2 = seededRandom(charSeed + Math.floor(flickerPhase * 1.6) * 17);
    const n3 = seededRandom(charSeed + Math.floor(flickerPhase * 0.55) * 23);
    const threshold = 0.42 + (1 - flickerDecay) * 0.32;
    isOn = n1 * 0.6 + n2 * 0.3 + n3 * 0.1 > threshold;

    const pop = seededRandom(charSeed + frame * 29);
    if (pop > 0.985 && flickerDecay > 0.25) isOn = true;

    if (flickerDecay > 0) {
      jitterX = (seededRandom(charSeed + frame * 7) - 0.5) * 0.8 * flickerDecay;
      jitterY = (seededRandom(charSeed + frame * 11) - 0.5) * 0.8 * flickerDecay;
      jitterRotation = (seededRandom(charSeed + frame * 19) - 0.5) * 0.35 * flickerDecay;
    }
  }

  // breathing pulse after settle
  const baseBrightness = isOn ? 1 : 0.12;
  const breathingPhase = currentTime >= flickerEndAt ? ((currentTime - flickerEndAt) * Math.PI * 2) / 1.6 : 0;
  const breathingMultiplier = currentTime >= flickerEndAt ? 1 + Math.sin(breathingPhase) * breathingAmplitude : 1;

  // Smooth settle (0..1) after flickerEndAt
  const settleT = Math.min(Math.max((currentTime - flickerEndAt) / Math.max(0.001, settleDuration), 0), 1);
  const settleEase = Easing.out(Easing.cubic)(settleT);

  const opacityBase = baseBrightness * breathingMultiplier;
  const opacity = opacityBase * (0.85 + 0.15 * settleEase);

  const coreGlow = 16 * glowStrength * breathingMultiplier;
  const midGlow = 32 * glowStrength * breathingMultiplier;
  const farGlow = 56 * glowStrength * breathingMultiplier;

  const settleScale = 0.98 + 0.02 * settleEase;
  const settleLift = (1 - settleEase) * 4;

  const letterStyle: React.CSSProperties = {
    display: 'inline-block',
    color: palette.primary,
    opacity,
    textShadow: `
      0 0 ${strokeSize}px ${strokeColor},
      0 0 ${Math.max(strokeSize - 1, 1)}px ${strokeColor},
      0 0 ${coreGlow}px ${palette.primary},
      0 0 ${midGlow}px ${palette.secondary},
      0 0 ${farGlow}px ${palette.accent}
    `,
    filter: `
      drop-shadow(0 0 ${coreGlow * 0.9}px ${palette.secondary})
      drop-shadow(0 0 ${farGlow * 0.6}px ${palette.accent})
    `,
    transform: `translate(${jitterX}px, ${jitterY - settleLift}px) rotate(${jitterRotation}deg) scale(${settleScale})`,
  };

  return <span style={letterStyle}>{char}</span>;
};

/* ------------------ film fx ------------------ */

const GrainOverlay: React.FC<{ intensity: number; seed: number; frame: number }> = ({
  intensity,
  seed,
  frame,
}) => {
  const o1 = seededRandom(seed + frame) * 4;
  const o2 = seededRandom(seed + frame + 1000) * 4;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intensity,
        background: `
          radial-gradient(circle at 30% 70%, rgba(255,255,255,0.04) 1px, transparent 1px),
          radial-gradient(circle at 70% 30%, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '4px 4px, 5px 5px',
        backgroundPosition: `${o1}px ${o2}px, ${o2}px ${o1}px`,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
  );
};

const Scanlines: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0, 255, 255, 0.02) 3px,
        rgba(0, 255, 255, 0.02) 5px
      )`,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    }}
  />
);

/* ------------------ main component ------------------ */

const NeonTubeFlicker: React.FC<NeonTubeFlickerProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, fps: studioFps } = useVideoConfig();

  const {
    title = 'DISCO INFERNO',
    titleLines,
    durationInSeconds = 5,
    fps = studioFps,
    palette = {
      primary: '#FFEE00',
      secondary: '#FF4D00',
      accent: '#FF00AA',
      bgTop: '#0A0011',
      bgBottom: '#220033',
    },
    grainIntensity = 0.2,
    scanlineOpacity = 0.12,
    glowStrength = 1.0,
    flickerEndAt = 2.0,
    breathingAmplitude = 0.08,
    letterSpacing = 0.03,
    safePadding = 84,
    showLogo = false,
    seed = 12345,
    settleDuration = 0.6,
  } = props;

  const currentTime = frame / fps;

  const gradientRotation = interpolate(frame, [0, durationInSeconds * fps], [0, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const [line1, line2] = titleLines ?? splitTitleToTwoLines(title);

  const longest = Math.max(line1.length, line2.length);
  const densityAdjust = longest > 10 ? Math.max(0.82, 1 - (longest - 10) * 0.03) : 1;
  const baseFont = Math.min(width * 0.16, height * 0.12) * densityAdjust;

  const afterSettle = Math.max(0, currentTime - flickerEndAt);
  const haloPulse = 1 + Math.sin((afterSettle * Math.PI * 2) / 1.6) * (breathingAmplitude * 1.2);
  const haloOpacity =
    interpolate(afterSettle, [0, 0.5], [0.0, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    haloPulse;

  const settleT = Math.min(Math.max((currentTime - flickerEndAt) / Math.max(0.001, settleDuration), 0), 1);
  const settleEase = Easing.out(Easing.cubic)(settleT);
  const dynamicLetterSpacingEm = (letterSpacing + 0.06) * (1 - settleEase) + letterSpacing * settleEase;

  const headlineContainer: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -56%)',
    width: `calc(100% - ${safePadding * 2}px)`,
    maxWidth: width - safePadding * 2,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: Math.max(6, baseFont * 0.12),
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${safePadding}px`,
    lineHeight: 0.9,
  };

  const halo: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: Math.min(width * 0.86, 900),
    height: Math.min(height * 0.35, 600),
    borderRadius: 28,
    background: `
      radial-gradient(50% 60% at 50% 50%, ${palette.accent}33 0%, transparent 65%),
      radial-gradient(40% 50% at 50% 50%, ${palette.secondary}33 0%, transparent 65%)
    `,
    filter: `blur(${Math.max(24, baseFont * 0.4)}px)`,
    opacity: haloOpacity,
    pointerEvents: 'none',
  };

  const lineStyle: React.CSSProperties = {
    fontFamily: '"Bebas Neue", Impact, "Oswald", "Arial Black", sans-serif',
    fontWeight: 800,
    fontSize: baseFont,
    letterSpacing: `${dynamicLetterSpacingEm}em`,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill>
      {/* Background */}
      <div
        style={{
          background: `
            radial-gradient(40% 55% at 20% 70%, ${palette.accent}2A 0%, transparent 60%),
            radial-gradient(40% 55% at 80% 30%, ${palette.secondary}29 0%, transparent 60%),
            linear-gradient(${135 + gradientRotation}deg, ${palette.bgTop} 0%, ${palette.bgBottom} 100%)
          `,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scanlines & Grain */}
      <Scanlines opacity={scanlineOpacity} />
      <GrainOverlay intensity={grainIntensity} seed={seed} frame={frame} />

      {/* Animated halo bloom behind headline */}
      <div style={halo} />

      {/* Headline */}
      <div style={headlineContainer}>
        <div style={lineStyle} aria-label={line1}>
          {line1.split('').map((ch, i) => (
            <Letter
              key={`l1-${i}`}
              char={ch}
              index={i}
              seed={seed + 10000}
              frame={frame}
              fps={fps}
              flickerEndAt={flickerEndAt}
              breathingAmplitude={breathingAmplitude}
              palette={palette}
              glowStrength={glowStrength}
              strokeColor="rgba(0,0,0,0.55)"
              strokeSize={3}
              settleDuration={settleDuration}
            />
          ))}
        </div>
        <div style={lineStyle} aria-label={line2}>
          {line2.split('').map((ch, i) => (
            <Letter
              key={`l2-${i}`}
              char={ch}
              index={i}
              seed={seed + 20000}
              frame={frame}
              fps={fps}
              flickerEndAt={flickerEndAt}
              breathingAmplitude={breathingAmplitude}
              palette={palette}
              glowStrength={glowStrength}
              strokeColor="rgba(0,0,0,0.55)"
              strokeSize={3}
              settleDuration={settleDuration}
            />
          ))}
        </div>
      </div>

      {/* Logo */}
      {showLogo && (
        <div
          style={{
            position: 'absolute',
            top: safePadding,
            right: safePadding,
            fontFamily: '"Bebas Neue", Impact, "Oswald", "Arial Black", sans-serif',
            fontWeight: 800,
            fontSize: width * 0.06,
            color: '#FFFFFF',
            textShadow: '0 0 4px rgba(0,0,0,0.6)',
          }}
        >
          LOGO
        </div>
      )}
    </AbsoluteFill>
  );
};

export default NeonTubeFlicker;

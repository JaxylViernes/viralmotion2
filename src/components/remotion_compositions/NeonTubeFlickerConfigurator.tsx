import  {useMemo, useState} from "react";
import {Player} from "@remotion/player";
// Assumes your NeonTubeFlicker component is exported from this path.
// If it's in a different file, update the import accordingly.
import NeonTubeFlicker from "./NeonTubeFlicker";

// --- Small helpers ---
const number = (v: string, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
}

const presets = {
  retroSunset: {
    primary: "#FFEE00",
    secondary: "#FF4D00",
    accent: "#FF00AA",
    bgTop: "#0A0011",
    bgBottom: "#220033",
  },
  electricBlue: {
    primary: "#7DF9FF",
    secondary: "#00C2FF",
    accent: "#7A5CFF",
    bgTop: "#040C1A",
    bgBottom: "#0E2247",
  },
  synthwave: {
    primary: "#FF71CE",
    secondary: "#01CDFE",
    accent: "#B967FF",
    bgTop: "#0B002B",
    bgBottom: "#330045",
  },
} satisfies Record<string, Palette>;

export default function NeonTubeFlickerConfigurator() {
  // --- Core video settings ---
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [fps, setFps] = useState(30);
  const [durationInSeconds, setDurationInSeconds] = useState(5);

  // --- Content settings ---
  const [title, setTitle] = useState("DISCO INFERNO");
  const [showLogo, setShowLogo] = useState(false);
  const [seed, setSeed] = useState(12345);

  // --- Visual FX ---
const [palette, setPalette] = useState<Palette>({
  primary: presets.retroSunset.primary,
  secondary: presets.retroSunset.secondary,
  accent: presets.retroSunset.accent,
  bgTop: presets.retroSunset.bgTop,
  bgBottom: presets.retroSunset.bgBottom,
});





  const [grainIntensity, setGrainIntensity] = useState(0.2);
  const [scanlineOpacity, setScanlineOpacity] = useState(0.12);
  const [glowStrength, setGlowStrength] = useState(1.0);
  const [flickerEndAt, setFlickerEndAt] = useState(2.0);
  const [settleDuration, setSettleDuration] = useState(0.6);
  const [breathingAmplitude, setBreathingAmplitude] = useState(0.08);
  const [letterSpacing, setLetterSpacing] = useState(0.03);
  const [safePadding, setSafePadding] = useState(84);

  const durationInFrames = useMemo(
    () => Math.max(1, Math.round(durationInSeconds * fps)),
    [durationInSeconds, fps]
  );

  const compProps = useMemo(
    () => ({
      title,
      durationInSeconds,
      fps,
      palette,
      grainIntensity,
      scanlineOpacity,
      glowStrength,
      flickerEndAt,
      breathingAmplitude,
      letterSpacing,
      safePadding,
      showLogo,
      seed,
      settleDuration,
    }),
    [
      title,
      durationInSeconds,
      fps,
      palette,
      grainIntensity,
      scanlineOpacity,
      glowStrength,
      flickerEndAt,
      breathingAmplitude,
      letterSpacing,
      safePadding,
      showLogo,
      seed,
      settleDuration,
    ]
  );

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 p-6 grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6">
      {/* Controls panel */}
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Neon Tube Flicker – Controls</h1>
          <p className="text-sm text-neutral-400">Tweak text, colors, timing and effects, then render or export.</p>
        </header>

        <section className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4 shadow">
          <h2 className="font-semibold">Text</h2>
          <label className="block text-sm mb-1">Title (use a newline or “|” for two lines)</label>
          <textarea
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500"
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="DISCO\nINFERNO"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
              />
              Show logo text
            </label>
            <label className="text-sm">
              Seed
              <input
                className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2"
                type="number"
                value={seed}
                onChange={(e) => setSeed(number(e.target.value, 12345))}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4 shadow">
          <h2 className="font-semibold">Palette</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presets).map(([key, p]) => (
              <button
                key={key}
                className="text-xs rounded-lg border border-neutral-800 px-3 py-1 bg-neutral-950 hover:bg-neutral-800 transition"
                onClick={() => setPalette(p)}
                title={key}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["primary", "secondary", "accent", "bgTop", "bgBottom"] as const).map((k) => (
              <label key={k} className="text-sm flex items-center justify-between gap-2">
                <span className="capitalize">{k}</span>
                <input
                  type="color"
                  value={palette[k]}
                  onChange={(e) => setPalette((old) => ({...old, [k]: e.target.value}))}
                  className="w-10 h-8 rounded border border-neutral-800 bg-neutral-950"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4 shadow">
          <h2 className="font-semibold">Timing</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Width
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" value={width} onChange={(e)=>setWidth(number(e.target.value, 1280))}/>
            </label>
            <label className="text-sm">Height
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" value={height} onChange={(e)=>setHeight(number(e.target.value, 720))}/>
            </label>
            <label className="text-sm">FPS
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" value={fps} onChange={(e)=>setFps(Math.max(1, number(e.target.value, 30)))}/>
            </label>
            <label className="text-sm">Duration (sec)
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" step="0.1" value={durationInSeconds} onChange={(e)=>setDurationInSeconds(Math.max(0.1, number(e.target.value, 5)))}/>
            </label>
            <label className="text-sm">Flicker ends at (sec)
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" step="0.1" value={flickerEndAt} onChange={(e)=>setFlickerEndAt(Math.max(0, number(e.target.value, 2)))}/>
            </label>
            <label className="text-sm">Settle duration (sec)
              <input className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2" type="number" step="0.05" value={settleDuration} onChange={(e)=>setSettleDuration(Math.max(0, number(e.target.value, 0.6)))}/>
            </label>
          </div>
        </section>

        <section className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4 shadow">
          <h2 className="font-semibold">Effects</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Grain intensity
              <input className="w-full mt-1" type="range" min={0} max={1} step={0.01} value={grainIntensity} onChange={(e)=>setGrainIntensity(number(e.target.value, 0.2))}/>
            </label>
            <label className="text-sm">Scanline opacity
              <input className="w-full mt-1" type="range" min={0} max={1} step={0.01} value={scanlineOpacity} onChange={(e)=>setScanlineOpacity(number(e.target.value, 0.12))}/>
            </label>
            <label className="text-sm">Glow strength
              <input className="w-full mt-1" type="range" min={0} max={2} step={0.01} value={glowStrength} onChange={(e)=>setGlowStrength(number(e.target.value, 1))}/>
            </label>
            <label className="text-sm">Breathing amplitude
              <input className="w-full mt-1" type="range" min={0} max={0.5} step={0.005} value={breathingAmplitude} onChange={(e)=>setBreathingAmplitude(number(e.target.value, 0.08))}/>
            </label>
            <label className="text-sm">Letter spacing (em)
              <input className="w-full mt-1" type="range" min={0} max={0.2} step={0.001} value={letterSpacing} onChange={(e)=>setLetterSpacing(number(e.target.value, 0.03))}/>
            </label>
            <label className="text-sm">Safe padding (px)
              <input className="w-full mt-1" type="range" min={0} max={200} step={1} value={safePadding} onChange={(e)=>setSafePadding(number(e.target.value, 84))}/>
            </label>
          </div>
        </section>
      </div>

      {/* Preview Player */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 shadow flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Preview</h2>
          <div className="text-sm text-neutral-400">{width}×{height} · {fps} fps · {durationInFrames} frames</div>
        </div>
        <div className="w-full flex-1 grid place-items-center">
          <Player
            component={NeonTubeFlicker}
            inputProps={compProps as any}
            durationInFrames={durationInFrames}
            compositionWidth={width}
            compositionHeight={height}
            fps={fps}
            controls
            style={{width: "100%", maxWidth: 1200, borderRadius: 16, overflow: "hidden"}}
          />
        </div>

        <details className="text-sm text-neutral-400">
          <summary className="cursor-pointer text-neutral-300">Show current props (debug)</summary>
          <pre className="mt-2 p-3 rounded-lg bg-neutral-950 border border-neutral-800 overflow-auto text-xs">
            {JSON.stringify(compProps, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

import type React from 'react';

interface EffectsConfig {
  grainIntensity: number;
  scanlineOpacity: number;
  glowStrength: number;
  breathingAmplitude: number;
  letterSpacing: number;
  safePadding: number;
}

export interface NeonTubeEffectsProps {
  effects: EffectsConfig;
  setEffects: (effects: EffectsConfig) => void;
}

const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  tip?: string;
}> = ({ label, value, min, max, step, onChange, unit = '', tip }) => (
  <label style={{ display: 'block', marginBottom: '1rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.3rem',
      }}
    >
      <span style={{ fontWeight: 600, color: '#333' }}>{label}</span>
      <span style={{ color: '#0077ff', fontVariantNumeric: 'tabular-nums' }}>
        {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%' }}
    />
    {tip && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem' }}>{tip}</p>}
  </label>
);

export const EffectsSection: React.FC<NeonTubeEffectsProps> = ({
  effects,
  setEffects,
}) => {
  const handleEffectChange = (
    key: keyof EffectsConfig,
    value: number
  ) => {
    setEffects({
      ...effects,
      [key]: value,
    });
  };

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
      }}
    >
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>✨ Visual Effects</h3>

      <SliderInput
        label="Glow Strength"
        value={effects.glowStrength}
        min={0}
        max={2}
        step={0.05}
        onChange={(v) => handleEffectChange('glowStrength', v)}
        tip="Overall intensity of the light bloom around the text."
      />
      
      <SliderInput
        label="Breathing Amplitude"
        value={effects.breathingAmplitude}
        min={0}
        max={0.5}
        step={0.01}
        onChange={(v) => handleEffectChange('breathingAmplitude', v)}
        tip="Subtle pulsing of the lights after the initial flicker."
      />
      
      <SliderInput
        label="Letter Spacing"
        value={effects.letterSpacing}
        min={0}
        max={0.2}
        step={0.005}
        onChange={(v) => handleEffectChange('letterSpacing', v)}
        unit="em"
      />
      
      <SliderInput
        label="Grain Intensity (Noise)"
        value={effects.grainIntensity}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => handleEffectChange('grainIntensity', v)}
      />

      <SliderInput
        label="Scanline Opacity (CRT)"
        value={effects.scanlineOpacity}
        min={0}
        max={0.5}
        step={0.01}
        onChange={(v) => handleEffectChange('scanlineOpacity', v)}
      />

      <SliderInput
        label="Safe Padding"
        value={effects.safePadding}
        min={0}
        max={200}
        step={1}
        onChange={(v) => handleEffectChange('safePadding', v)}
        unit="px"
        tip="Padding around the text container."
      />

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Fine-tune the light, film, and layout properties of the neon effect.
      </p>
    </div>
  );
};
import type React from 'react';

interface TimingConfig {
  durationInSeconds: number;
  flickerEndAt: number;
  settleDuration: number;
  fps?: number; 
}

export interface NeonTubeTimingProps {
  timing: TimingConfig;
  setTiming: (timing: TimingConfig) => void;
}

const NumberInput: React.FC<{
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  tip?: string;
}> = ({ label, value, min, step, onChange, unit = '', tip }) => (
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
        {value.toFixed(step < 1 ? 2 : 0)} {unit}
      </span>
    </div>
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
    />
    {tip && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem' }}>{tip}</p>}
  </label>
);

export const TimingSection: React.FC<NeonTubeTimingProps> = ({
  timing,
  setTiming,
}) => {
  const handleTimingChange = (
    key: keyof TimingConfig,
    value: number
  ) => {
    setTiming({
      ...timing,
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>⏱️ Timing</h3>
      
      <NumberInput
        label="Video Duration"
        value={timing.durationInSeconds}
        min={0.1}
        step={0.1}
        onChange={(v) => handleTimingChange('durationInSeconds', v)}
        unit="sec"
      />

      <NumberInput
        label="Flicker Ends At"
        value={timing.flickerEndAt}
        min={0}
        step={0.1}
        onChange={(v) => handleTimingChange('flickerEndAt', v)}
        unit="sec"
        tip="The text will stop randomly flickering after this time."
      />

      <NumberInput
        label="Settle Duration"
        value={timing.settleDuration}
        min={0}
        step={0.05}
        onChange={(v) => handleTimingChange('settleDuration', v)}
        unit="sec"
        tip="Time for the lights to smoothly transition from flicker to stable."
      />

      {/* FPS is generally set globally, but included for completeness if needed */}
      {/* <NumberInput
        label="Frames Per Second (FPS)"
        value={timing.fps || 30}
        min={1}
        step={1}
        onChange={(v) => handleTimingChange('fps', v)}
      /> */}
      
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Control the total video length and the timing of the neon flicker effect.
      </p>
    </div>
  );
};
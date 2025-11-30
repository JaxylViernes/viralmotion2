import type React from 'react';
import type { Palette } from '../../../remotion_compositions/NeonTubeFlicker';

export interface NeonTubeColorProps {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

export const ColorSection: React.FC<NeonTubeColorProps> = ({
  palette,
  setPalette,
}) => {
  const handleColorChange = (
    key: keyof Palette,
    value: string
  ) => {
    setPalette({
      ...palette,
      [key]: value,
    });
  };

  const colorInputStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    padding: '0.5rem',
    background: '#fafafa',
    borderRadius: '8px',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#333',
  };

  const inputStyle: React.CSSProperties = {
    width: '100px',
    height: '30px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  const paletteKeys: (keyof Palette)[] = ['primary', 'secondary', 'accent', 'bgTop', 'bgBottom'];
  const labelMap: Record<keyof Palette, string> = {
      primary: 'Primary Tube Color',
      secondary: 'Secondary Glow Color',
      accent: 'Accent Glow Color',
      bgTop: 'Background Top Color',
      bgBottom: 'Background Bottom Color',
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
        overflow: 'visible',
      }}
    >
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>🎨 Neon Palette</h3>

      {paletteKeys.map((key) => (
        <div key={key} style={colorInputStyle}>
          <label style={labelStyle}>{labelMap[key]}</label>
          <input
            type="color"
            value={palette[key]}
            onChange={(e) => handleColorChange(key, e.target.value)}
            style={inputStyle}
          />
        </div>
      ))}

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Configure the main colors for the neon text and the background gradient.
      </p>
    </div>
  );
};
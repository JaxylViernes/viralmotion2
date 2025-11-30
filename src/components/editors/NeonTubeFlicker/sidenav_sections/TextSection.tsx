import type React from 'react';

export interface NeonTubeTextProps {
  title: string;
  showLogo: boolean;
  seed: number;
  setText: (props: { 
    title: string;
    showLogo: boolean;
    seed: number;
  }) => void;
}

const textInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  background: '#fafafa',
  fontSize: 14,
};

export const TextSection: React.FC<NeonTubeTextProps> = ({
  title,
  showLogo,
  seed,
  setText,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText({ title: e.target.value, showLogo, seed });
  };

  const handleLogoToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ title, showLogo: e.target.checked, seed });
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setText({ title, showLogo, seed: isNaN(value) ? 12345 : value });
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>
        📝 Phrase & Title
      </h3>

      {/* --- Title Input (Textarea for multiline) --- */}
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
          Title (Use `\n` or `|` for two lines)
        </div>
        <textarea
          rows={2}
          value={title}
          onChange={handleTitleChange}
          style={{ ...textInputStyle, minHeight: '80px' }}
        />
      </label>

      {/* --- Checkbox for Logo --- */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showLogo}
            onChange={handleLogoToggle}
          />
          <span style={{ color: '#333', fontWeight: 600 }}>Show Corner Logo Text</span>
        </label>
      </div>

      {/* --- Seed Input --- */}
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
          Animation Seed
        </div>
        <input
          type="number"
          value={seed}
          onChange={handleSeedChange}
          style={textInputStyle}
          min={0}
        />
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Changing the seed alters the random flicker pattern.
        </p>
      </label>
    </div>
  );
};
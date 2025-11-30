// src/components/editor/components/KenBurnsEditor.tsx

import React, { useRef } from 'react';
import type { Layer, ImageLayer } from '../../remotion_compositions/DynamicLayerComposition';

interface KenBurnsEditorProps {
  layers: Layer[];
  onUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onDelete: (layerId: string) => void;
  onAddImage: (imageUrl: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const KenBurnsEditor: React.FC<KenBurnsEditorProps> = ({
  layers,
  onUpdate,
  onDelete,
  onAddImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all image layers sorted by ID (to maintain order)
  const imageLayers = layers
    .filter((l): l is ImageLayer => l.type === 'image')
    .sort((a, b) => a.id.localeCompare(b.id));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload to your cloud storage
    // For now, create a local URL
    const imageUrl = URL.createObjectURL(file);
    onAddImage(imageUrl);
  };

  const handleReplaceImage = async (layerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    onUpdate(layerId, { src: imageUrl } as Partial<ImageLayer>);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Carousel Images</h3>
        <p style={styles.subtitle}>
          {imageLayers.length} image{imageLayers.length !== 1 ? 's' : ''} • {imageLayers.length * 3}s duration
        </p>
      </div>

      {/* Image Grid */}
      <div style={styles.imageGrid}>
        {imageLayers.map((layer, index) => (
          <div key={layer.id} style={styles.imageCard}>
            {/* Image Preview */}
            <div style={styles.imagePreview}>
              <img
                src={layer.src}
                alt={layer.name}
                style={styles.image}
              />
              
              {/* Order Badge */}
              <div style={styles.orderBadge}>
                {index + 1}
              </div>
            </div>

            {/* Controls */}
            <div style={styles.imageControls}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleReplaceImage(layer.id, e)}
                id={`replace-${layer.id}`}
              />
              <button
                style={styles.controlButton}
                onClick={() => document.getElementById(`replace-${layer.id}`)?.click()}
                title="Replace image"
              >
                <ReplaceIcon />
              </button>
              
              {imageLayers.length > 1 && (
                <button
                  style={{ ...styles.controlButton, ...styles.deleteButton }}
                  onClick={() => onDelete(layer.id)}
                  title="Delete image"
                >
                  <TrashIcon />
                </button>
              )}
            </div>

            {/* Image Name */}
            <div style={styles.imageName}>
              {layer.name}
            </div>
          </div>
        ))}

        {/* Add New Image Card */}
        <div style={styles.addCard} onClick={() => fileInputRef.current?.click()}>
          <div style={styles.addIcon}>
            <PlusIcon />
          </div>
          <span style={styles.addText}>Add Image</span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Settings Section */}
      <div style={styles.settingsSection}>
        <h4 style={styles.settingsTitle}>Carousel Settings</h4>
        
        <div style={styles.setting}>
          <label style={styles.settingLabel}>
            Card Size
            <span style={styles.settingValue}>75%</span>
          </label>
          <input
            type="range"
            min="50"
            max="100"
            defaultValue="75"
            style={styles.slider}
          />
        </div>

        <div style={styles.setting}>
          <label style={styles.settingLabel}>
            Background Blur
            <span style={styles.settingValue}>0%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            style={styles.slider}
          />
        </div>
      </div>

      {/* Tips */}
      <div style={styles.tips}>
        <p style={styles.tipText}>
          💡 <strong>Tip:</strong> Each image plays for 3 seconds with a smooth Ken Burns zoom effect
        </p>
        <p style={styles.tipText}>
          🎬 <strong>Duration:</strong> Add or remove images to adjust total video length
        </p>
      </div>
    </div>
  );
};

// Icons
const PlusIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const ReplaceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    height: '100%',
    overflowY: 'auto',
    backgroundColor: '#0a0a0a',
    color: '#fff',
  },
  header: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  imageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s',
    cursor: 'move',
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    paddingBottom: '133.33%', // 3:4 aspect ratio
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  orderBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  imageControls: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  imageName: {
    padding: '8px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  addCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    gap: '8px',
  },
  addIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  addText: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  settingsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  settingsTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  setting: {
    marginBottom: '16px',
  },
  settingLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '8px',
  },
  settingValue: {
    color: '#3b82f6',
    fontWeight: 600,
  },
  slider: {
    width: '100%',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    outline: 'none',
    cursor: 'pointer',
  },
  tips: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    padding: '12px',
  },
  tipText: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
  },
};
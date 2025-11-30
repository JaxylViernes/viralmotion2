import React, { useState } from "react";
import { type AudioLayer } from "../../remotion_compositions/DynamicLayerComposition";
import { modernEditorStyles as styles } from "../styles/modernEditorStyles";
// import { EditorIcons } from "./EditorIcons";
import { FPS } from "../constants";

interface AudioEditorProps {
  layer: AudioLayer;
  totalFrames: number;
  onUpdate: (layerId: string, updates: Partial<AudioLayer>) => void;
  onDelete: (layerId: string) => void;
  onReplace: () => void;
}

/**
 * Modern AudioEditor - Redesigned for compact, clean UI
 */
export const AudioEditor: React.FC<AudioEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const duration = Math.round((layer.endFrame - layer.startFrame) / FPS);

  return (
    <div style={styles.container}>
      {/* Replace Button */}
      <div style={styles.section}>
        <button
          style={styles.buttonSecondary}
          onClick={onReplace}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#1f1f1f";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          {/* {EditorIcons.music} */}
          Replace Audio
        </button>
      </div>

      {/* Duration */}
      <div style={styles.sectionCompact}>
        <div style={styles.propertyRow}>
          <span style={styles.propertyLabel}>Duration</span>
          <span style={styles.propertyValue}>{duration}s</span>
        </div>
        <div style={styles.sliderWrapper}>
          <input
            type="range"
            style={styles.slider}
            min={layer.startFrame}
            max={totalFrames}
            value={layer.endFrame}
            onChange={(e) => onUpdate(layer.id, { endFrame: parseInt(e.target.value) })}
          />
          <span style={styles.sliderValue}>{layer.endFrame}f</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>AUDIO</div>

        <div style={styles.formGroupCompact}>
          <label style={styles.label}>Volume</label>
          <div style={styles.sliderWrapper}>
            <input
              type="range"
              style={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={layer.volume}
              onChange={(e) => onUpdate(layer.id, { volume: parseFloat(e.target.value) })}
            />
            <span style={styles.sliderValue}>{Math.round(layer.volume * 100)}%</span>
          </div>
        </div>

        <div style={styles.formGroupCompact}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={layer.loop || false}
              onChange={(e) => onUpdate(layer.id, { loop: e.target.checked })}
            />
            <span>Loop audio</span>
          </label>
        </div>
      </div>

      {/* Quick Volume Presets */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>PRESETS</div>
        <div style={styles.grid4}>
          <button
            style={{
              ...styles.card,
              padding: "8px 4px",
              ...(layer.volume === 0.25 ? styles.iconButtonActive : {}),
            }}
            onClick={() => onUpdate(layer.id, { volume: 0.25 })}
            onMouseEnter={(e) => {
              if (layer.volume !== 0.25) {
                e.currentTarget.style.backgroundColor = "#1f1f1f";
              }
            }}
            onMouseLeave={(e) => {
              if (layer.volume !== 0.25) {
                e.currentTarget.style.backgroundColor = "#141414";
              }
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "600" }}>25%</div>
          </button>
          <button
            style={{
              ...styles.card,
              padding: "8px 4px",
              ...(layer.volume === 0.5 ? styles.iconButtonActive : {}),
            }}
            onClick={() => onUpdate(layer.id, { volume: 0.5 })}
            onMouseEnter={(e) => {
              if (layer.volume !== 0.5) {
                e.currentTarget.style.backgroundColor = "#1f1f1f";
              }
            }}
            onMouseLeave={(e) => {
              if (layer.volume !== 0.5) {
                e.currentTarget.style.backgroundColor = "#141414";
              }
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "600" }}>50%</div>
          </button>
          <button
            style={{
              ...styles.card,
              padding: "8px 4px",
              ...(layer.volume === 0.75 ? styles.iconButtonActive : {}),
            }}
            onClick={() => onUpdate(layer.id, { volume: 0.75 })}
            onMouseEnter={(e) => {
              if (layer.volume !== 0.75) {
                e.currentTarget.style.backgroundColor = "#1f1f1f";
              }
            }}
            onMouseLeave={(e) => {
              if (layer.volume !== 0.75) {
                e.currentTarget.style.backgroundColor = "#141414";
              }
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "600" }}>75%</div>
          </button>
          <button
            style={{
              ...styles.card,
              padding: "8px 4px",
              ...(layer.volume === 1 ? styles.iconButtonActive : {}),
            }}
            onClick={() => onUpdate(layer.id, { volume: 1 })}
            onMouseEnter={(e) => {
              if (layer.volume !== 1) {
                e.currentTarget.style.backgroundColor = "#1f1f1f";
              }
            }}
            onMouseLeave={(e) => {
              if (layer.volume !== 1) {
                e.currentTarget.style.backgroundColor = "#141414";
              }
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "600" }}>100%</div>
          </button>
        </div>
      </div>

      {/* Advanced - Collapsible */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span style={styles.sectionTitle}>ADVANCED</span>
          <span
            style={{
              ...styles.collapseIcon,
              transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {showAdvanced && (
          <div style={styles.grid2}>
            <div style={styles.formGroupCompact}>
              <label style={styles.label}>Fade In (frames)</label>
              <input
                type="number"
                style={styles.input}
                value={layer.fadeIn || 0}
                min="0"
                max="60"
                onChange={(e) => onUpdate(layer.id, { fadeIn: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div style={styles.formGroupCompact}>
              <label style={styles.label}>Fade Out (frames)</label>
              <input
                type="number"
                style={styles.input}
                value={layer.fadeOut || 0}
                min="0"
                max="60"
                onChange={(e) => onUpdate(layer.id, { fadeOut: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={styles.section}>
        <div style={{ ...styles.helpText, textAlign: "center" }}>
          🎵 Audio plays throughout the timeline
        </div>
      </div>

      {/* Delete Button */}
      <div style={styles.section}>
        <button
          style={styles.deleteButton}
          onClick={() => {
            if (window.confirm("Delete this audio layer?")) {
              onDelete(layer.id);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
          }}
        >
          {/* {EditorIcons.trash} */}
          Delete Layer
        </button>
      </div>
    </div>
  );
};
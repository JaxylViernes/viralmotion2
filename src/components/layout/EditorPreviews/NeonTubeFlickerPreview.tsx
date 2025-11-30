import React, { useMemo } from 'react';
import { Player } from '@remotion/player'; 
import NeonTubeFlicker from '../../remotion_compositions/NeonTubeFlicker';
import type { NeonTubeFlickerProps } from '../../remotion_compositions/NeonTubeFlicker'; 

const RemotionFlickerPlayer: React.FC<{
  config: NeonTubeFlickerProps;
  compositionWidth: number;
  compositionHeight: number;
}> = ({ config, compositionWidth, compositionHeight }) => {
  const fps = config.fps || 30;
  const durationInFrames = Math.max(1, Math.round((config.durationInSeconds || 5) * fps)); 

  // Clean up config for player input props
  const inputProps = useMemo(() => {
    // We only pass the properties relevant to the Remotion composition
    const { fps: _, ...rest } = config; 
    return rest;
  }, [config]);

  return (
    <Player
      key={JSON.stringify(config)}
      component={NeonTubeFlicker}
      inputProps={inputProps as any}
      durationInFrames={durationInFrames}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      fps={fps}
      controls
      autoPlay
      loop
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

interface PreviewProps {
  config: NeonTubeFlickerProps;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
  showSafeMargins: boolean;
  isMobile: boolean; 
  compositionWidth: number; // 1080
  compositionHeight: number; // 1920
  onToggleSafeMargins: (value: boolean) => void;
}

export const NeonTubeFlickerPreview: React.FC<PreviewProps> = ({
  config,
  previewScale,
  onPreviewScaleChange,
  showSafeMargins,
  isMobile,
  compositionWidth,
  compositionHeight,
  onToggleSafeMargins
}) => {
  
  // Use a fixed dark background for this preview since the background is part of the composition
  const bgHex = '#080811'; // A very dark color matching the general aesthetic
  const aspectRatio = compositionWidth / compositionHeight;
  const previewWidthBase = 300; // Base width for preview, adjusted for portrait
  const previewWidth = previewWidthBase; 
  const previewHeight = previewWidth / aspectRatio;
  
  const effectivePreviewScale = isMobile ? 0.9 : previewScale;
  // Simplified Preview component compared to Heatmap, removing background cycle
  

  return (
    <div
      style={{
        flex: '1', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgHex,
        transition: 'background 0.3s',
        position: 'relative',
        order: isMobile ? -1 : 0, 
        overflow: 'hidden',
      }}
    >
      
      {/* Checkbox for Safe Margins - always visible but position adjusted */}
      <label
        style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px',
          left: isMobile ? '10px' : '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          // Placeholder for the handler that doesn't exist in props (or could be passed through)
          onChange={(e) => onToggleSafeMargins(e.target.checked)} 
        />
        Show margins
      </label>

      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <button
            title="Increase Live Preview Size"
            onClick={() =>
              onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
            }
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'white',
              color: 'black',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
          >
            +
          </button>
          <button
            title="Decrease Live Preview Size"
            onClick={() =>
              onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
            }
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'white',
              color: 'black',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
          >
            –
          </button>
        </div>
      )}

      <div
        style={{
          transform: `scale(${effectivePreviewScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s',
        }}
      >
        {/* Preview container with 1080x1920 aspect ratio */}
        <div
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            border: '3px solid #222',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          <RemotionFlickerPlayer
            config={config}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
          />

          {/* Optional safe margins overlay. Padding is relative to the Remotion composition's safePadding */}
          {showSafeMargins && (
            <div
              style={{
                position: 'absolute',
                // Using compositionHeight for calculation to maintain symmetric percentage based on the taller dimension
                inset: `${((config.safePadding || 84) / compositionHeight) * 100}%`,
                border: '2px dashed rgba(255,255,255,0.25)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
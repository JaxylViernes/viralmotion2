import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  Video,
  Sequence,
} from "remotion";

// ============================================================================
// TYPES
// ============================================================================

export interface LayerBase {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  startFrame: number;
  endFrame: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  animation?: {
   entrance?: "fade" | "slideUp" | "slideDown" | "scale" | "bounce" | "zoomPunch" | "popIn" | "rotate" | "none";
    entranceDuration?: number;
  };
}

export interface TextLayer extends LayerBase {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textOutline?: boolean;
  outlineColor?: string;
  textShadow?: boolean;
  shadowColor?: string;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;

  highlightWords?: string[];
  highlightColor?: string;  
}

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  isBackground?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  filter?: string;
}

export interface AudioLayer extends LayerBase {
  type: "audio";
  src: string;
  volume: number;
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

export interface VideoLayer extends LayerBase {
  type: "video";
  src: string;
  volume: number;
  loop?: boolean;
  playbackRate?: number;
  objectFit?: "cover" | "contain" | "fill";
  filter?: string;
  fadeIn?: number;
  fadeOut?: number;
  
  // ✅ NEW: Border support for PiP
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export type Layer = TextLayer | ImageLayer | AudioLayer | VideoLayer;

export function isTextLayer(layer: Layer): layer is TextLayer {
  return layer.type === "text";
}

export function isImageLayer(layer: Layer): layer is ImageLayer {
  return layer.type === "image";
}

export function isAudioLayer(layer: Layer): layer is AudioLayer {
  return layer.type === "audio";
}

export function isVideoLayer(layer: Layer): layer is VideoLayer {
  return layer.type === "video";
}

export interface DynamicCompositionProps {
  layers: Layer[];
  backgroundColor?: string;
  editingLayerId?: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getEntranceAnimation = (
  layer: Layer,
  relativeFrame: number,
  fps: number
) => {
  const animation = layer.animation?.entrance || "fade";
  const duration = layer.animation?.entranceDuration || 30;

  if (animation === "none") {
    return { opacity: 1, transform: "" };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: duration,
  });

  const opacity = interpolate(relativeFrame, [0, duration * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  switch (animation) {
    case "slideUp":
      return {
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
      };
    case "slideDown":
      return {
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [-50, 0])}px)`,
      };
    case "scale":
      return {
        opacity,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
      };
    case "fade":
    default:
      return {
        opacity,
        transform: "", 
      };

     case "bounce":
      return {
        opacity,
        transform: `translateY(${interpolate(
          progress,
          [0, 0.3, 0.6, 0.8, 1],
          [100, -20, 10, -5, 0]
        )}px)`,
      };
    case "zoomPunch":
      return {
        opacity,
        transform: `scale(${interpolate(
          progress,
          [0, 0.5, 1],
          [0.5, 1.1, 1]
        )})`,
      };
    case "popIn":
      return {
        opacity: interpolate(relativeFrame, [0, duration * 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(
          progress,
          [0, 0.6, 1],
          [0, 1.2, 1]
        )})`,
      };
    case "rotate":
      return {
        opacity,
        transform: `rotate(${interpolate(progress, [0, 1], [180, 0])}deg)`,
      };
  }
};

const buildTextShadow = (layer: TextLayer): string => {
  if (!layer.textShadow) return "none";
  
  const x = layer.shadowX || 0;
  const y = layer.shadowY || 0;
  const blur = layer.shadowBlur || 0;
  const color = layer.shadowColor || "#000000";
  
  return `${x}px ${y}px ${blur}px ${color}`;
};

const buildTextStroke = (layer: TextLayer): React.CSSProperties => {
  if (!layer.textOutline) return {};
  
  const outlineColor = layer.outlineColor || "#000000";
  
  return {
    WebkitTextStroke: `1px ${outlineColor}`,
    paintOrder: "stroke fill",
  };
};


// ============================================================================
// TEXT LAYER COMPONENT
// ============================================================================

const TextLayerComponent: React.FC<{
  layer: TextLayer;
  relativeFrame: number;
  fps: number;
  width: number;
  height: number;
}> = React.memo(({ layer, relativeFrame, fps, height }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const scaledFontSize = (layer.fontSize / 100) * height;
  const words = layer.content.split(" ");
  const wordDelay = 3;
  const textShadowStyle = buildTextShadow(layer);
  const textStrokeStyle = buildTextStroke(layer);

  const animationTransform = entrance.transform === "none" ? "" : entrance.transform;

  return (
    <div
      style={{
        position: "absolute",
        left: `${layer.position.x}%`,
        top: `${layer.position.y}%`,
        width: `${layer.size.width}%`,
        height: `${layer.size.height}%`,
        
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) ${animationTransform}`,
        transformOrigin: "center center",
        
        fontFamily: layer.fontFamily,
        fontSize: scaledFontSize,
        fontWeight: layer.fontWeight,
        fontStyle: layer.fontStyle,
        color: layer.fontColor,
        textAlign: layer.textAlign,
        lineHeight: layer.lineHeight,
        letterSpacing: layer.letterSpacing || 0,
        textTransform: layer.textTransform || "none",
        textShadow: textShadowStyle,
        ...textStrokeStyle,
        
        display: "flex",
        alignItems: "center",
        justifyContent:
          layer.textAlign === "center"
            ? "center"
            : layer.textAlign === "right"
            ? "flex-end"
            : "flex-start",
        flexWrap: "wrap",
        gap: "0.3em",
      }}
    >
      {words.map((word, i) => {
        const wordOpacity = interpolate(
          relativeFrame - i * wordDelay,
          [0, 20],
          [0, 1],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
        const isHighlighted = layer.highlightWords?.some(
          (hw) => hw.toLowerCase() === cleanWord
        );
        
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: wordOpacity * layer.opacity * entrance.opacity,
              backgroundColor: isHighlighted 
                ? (layer.highlightColor || "rgba(255, 215, 0, 0.4)") 
                : "transparent",
              padding: isHighlighted ? "4px 6px" : "0",
              borderRadius: isHighlighted ? "4px" : "0",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
});

// ============================================================================
// IMAGE LAYER COMPONENT
// ============================================================================

const ImageLayerComponent: React.FC<{
  layer: ImageLayer;
  relativeFrame: number;
  fps: number;
}> = React.memo(({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  
  const animationTransform = entrance.transform === "none" ? "" : entrance.transform;

  if (layer.isBackground) {
    const bgOpacity = interpolate(relativeFrame, [0, 60], [0, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ opacity: bgOpacity * layer.opacity }}>
        <Img
          src={layer.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: layer.objectFit || "cover",
            filter: layer.filter || "brightness(0.6)",
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
   <div
  style={{
    position: "absolute",
    left: `${layer.position.x}%`,
    top: `${layer.position.y}%`,
    width: `${layer.size.width}%`,
    height: `${layer.size.height}%`,
    
    transform: `translate(-50%, -50%) ${animationTransform}`,
    transformOrigin: "center center",
    overflow: "hidden",
  }}
>
  <img
    src={layer.src}
    style={{
      width: "100%",
      height: "100%",
      objectFit: layer.objectFit || "contain",
      opacity: entrance.opacity * layer.opacity,
      filter: layer.filter || "none",
      transform: `rotate(${layer.rotation}deg)`,
      transformOrigin: "center center",
    }}
    alt={layer.name}
  />
</div>
  );
});

// ============================================================================
// AUDIO LAYER COMPONENT
// ============================================================================

const AudioLayerComponent: React.FC<{
  layer: AudioLayer;
  relativeFrame: number;
  fps: number;
}> = React.memo(({ layer, relativeFrame }) => {
  const duration = layer.endFrame - layer.startFrame;
  let volume = layer.volume;
  
  if (layer.fadeIn && relativeFrame < layer.fadeIn) {
    volume = interpolate(relativeFrame, [0, layer.fadeIn], [0, layer.volume], {
      extrapolateRight: "clamp",
    });
  }
  
  if (layer.fadeOut && relativeFrame > duration - layer.fadeOut) {
    volume = interpolate(
      relativeFrame,
      [duration - layer.fadeOut, duration],
      [layer.volume, 0],
      { extrapolateLeft: "clamp" }
    );
  }

  return (
    <Audio
      src={layer.src}
      volume={volume}
      loop={layer.loop}
    />
  );
});

// ============================================================================
// VIDEO LAYER COMPONENT
// ============================================================================

const VideoLayerComponent: React.FC<{
  layer: VideoLayer;
  relativeFrame: number;
  fps: number;
}> = React.memo(({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const duration = layer.endFrame - layer.startFrame;
  
  const animationTransform = entrance.transform === "none" ? "" : entrance.transform;
  
  let volume = layer.volume;
  
  if (layer.fadeIn && relativeFrame < layer.fadeIn) {
    volume = interpolate(relativeFrame, [0, layer.fadeIn], [0, layer.volume], {
      extrapolateRight: "clamp",
    });
  }
  
  if (layer.fadeOut && relativeFrame > duration - layer.fadeOut) {
    volume = interpolate(
      relativeFrame,
      [duration - layer.fadeOut, duration],
      [layer.volume, 0],
      { extrapolateLeft: "clamp" }
    );
  }

  const finalOpacity = entrance.opacity * layer.opacity;

  return (
   <div
  style={{
    position: "absolute",
    left: `${layer.position.x}%`,
    top: `${layer.position.y}%`,
    width: `${layer.size.width}%`,
    height: `${layer.size.height}%`,
    transform: `translate(-50%, -50%) ${animationTransform}`,
    transformOrigin: "center center",
    overflow: "hidden",
    
    // ✅ BORDER STYLES
    border: layer.borderWidth ? `${layer.borderWidth}px solid ${layer.borderColor || '#38bdf8'}` : 'none',
    boxSizing: 'border-box',
    borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : '0px',
    // Ensure border doesn't get cut off
    zIndex: 1, 
  }}
>
  <Video
    src={layer.src}
    style={{
      width: "100%",
      height: "100%",
      objectFit: layer.objectFit || "contain",
      opacity: finalOpacity,
      filter: layer.filter || "none",
      transform: `rotate(${layer.rotation}deg)`,
      transformOrigin: "center center",
    }}
    volume={volume}
    playbackRate={layer.playbackRate || 1}
    startFrom={0} 
    loop={layer.loop}
  />
</div>
  );
});

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const DynamicLayerComposition: React.FC<DynamicCompositionProps> = ({
  layers,
  backgroundColor = "#000",
  editingLayerId = null,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // ✅ FIXED SORT ORDER: ASCENDING
  // This ensures the first item in the list (Background) renders first,
  // and subsequent items (like overlays) render ON TOP.
  const visibleLayers = useMemo(() => 
    layers
      .map((layer, index) => ({ layer, originalIndex: index }))
      .filter(({ layer }) => {
        if (!layer.visible) return false;
        if (layer.id === editingLayerId && isTextLayer(layer)) return false;
        return frame >= layer.startFrame && frame <= layer.endFrame;
      })
      .sort((a, b) => {
        // Always force strict "isBackground" images to the absolute bottom (start of render list)
        if (isImageLayer(a.layer) && a.layer.isBackground) return -1;
        if (isImageLayer(b.layer) && b.layer.isBackground) return 1;
        
        // ASCENDING ORDER: 0, 1, 2, 3...
        // Index 0 (Top of Timeline) = Background (Rendered First)
        // Index 10 (Bottom of Timeline) = Foreground (Rendered Last)
        return a.originalIndex - b.originalIndex;
      }),
    [layers, frame, editingLayerId]
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      
      {/* ✅ UNIFIED RENDER LOOP */}
      {visibleLayers.map(({ layer }) => {
        if (isImageLayer(layer)) {
          const relativeFrame = Math.max(0, frame - layer.startFrame);
          return (
            <ImageLayerComponent
              key={layer.id}
              layer={layer}
              relativeFrame={relativeFrame}
              fps={fps}
            />
          );
        }
        
        if (isVideoLayer(layer)) {
          return (
            <Sequence
              key={layer.id}
              from={layer.startFrame}
              durationInFrames={layer.endFrame - layer.startFrame}
            >
              <VideoLayerComponent
                layer={layer}
                relativeFrame={Math.max(0, frame - layer.startFrame)}
                fps={fps}
              />
            </Sequence>
          );
        }

        if (isTextLayer(layer)) {
          const relativeFrame = Math.max(0, frame - layer.startFrame);
          return (
            <TextLayerComponent
              key={layer.id}
              layer={layer}
              relativeFrame={relativeFrame}
              fps={fps}
              width={width}
              height={height}
            />
          );
        }

        return null;
      })}

      {/* Audio stays separate */}
      {layers
        .filter((layer): layer is AudioLayer => 
          isAudioLayer(layer) && layer.visible && layer.id !== editingLayerId
        )
        .map((layer) => (
          <Sequence
            key={layer.id}
            from={layer.startFrame}
            durationInFrames={layer.endFrame - layer.startFrame}
          >
            <AudioLayerComponent
              layer={layer}
              relativeFrame={Math.max(0, frame - layer.startFrame)}
              fps={fps}
            />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

export default DynamicLayerComposition;
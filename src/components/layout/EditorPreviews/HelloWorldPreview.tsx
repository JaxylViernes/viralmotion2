import React from "react";
import { Player } from "@remotion/player";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// --------------------------------------------
// 1. The Remotion Component
// --------------------------------------------
export const HelloRemotion: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 80,
        fontFamily: "sans-serif",
        opacity,
      }}
    >
      {title}
    </div>
  );
};

// --------------------------------------------
// 2. Wrapper component for Remotion Player
// --------------------------------------------
const HelloRemotionComponent: React.FC<{ title: string }> = ({ title }) => {
  return <HelloRemotion title={title} />;
};

// --------------------------------------------
// 3. The Remotion Player wrapper
// --------------------------------------------
export const HelloRemotionPlayer: React.FC<{
  title: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  duration: number;
}> = ({
  title,
  autoPlay = true,
  controls = true,
  loop = true,
  duration, // seconds
}) => {
  return (
    <Player
      component={HelloRemotionComponent}
      inputProps={{ title }}
      durationInFrames={duration * 30}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1920}
      autoPlay={autoPlay}
      controls={controls}
      loop={loop}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

// --------------------------------------------
// 4. Full UI Preview Component (phone preview)
// --------------------------------------------
export const HelloRemotionPreview: React.FC<{
  title: string;
  showSafeMargins: boolean;
  previewBg: string;
  cycleBg: () => void;
  previewScale: number;
  onPreviewScaleChange: (value: number) => void;
  onToggleSafeMargins: (value: boolean) => void;
  duration: number;
}> = ({
  title,
  showSafeMargins,
  previewBg,
  cycleBg,
  previewScale,
  onPreviewScaleChange,
  onToggleSafeMargins,
  duration,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          previewBg === "dark"
            ? "#000"
            : previewBg === "light"
            ? "#f0f0f0"
            : "#ccc",
        transition: "background 0.3s",
        position: "relative",
      }}
    >
      {/* Theme Toggle */}
      <button
        onClick={cycleBg}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "0.6rem 1rem",
          borderRadius: "30px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {previewBg === "dark"
          ? "🌞 Light"
          : previewBg === "light"
          ? "⬜ Grey"
          : "🌙 Dark"}
      </button>

      {/* Safe margins checkbox */}
      <label
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={(e) => onToggleSafeMargins(e.target.checked)}
        />
        Show margins
      </label>

      {/* + / – scale controls */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <button
          onClick={() =>
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          +
        </button>

        <button
          onClick={() =>
            onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          –
        </button>
      </div>

      {/* Scaled preview container */}
      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "270px",
            height: "480px",
            border: "3px solid #222",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            position: "relative",
          }}
        >
          <HelloRemotionPlayer title={title} duration={duration} />

          {showSafeMargins && (
            <div
              style={{
                position: "absolute",
                inset: "5%",
                border: "2px dashed rgba(255,255,255,0.25)",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
